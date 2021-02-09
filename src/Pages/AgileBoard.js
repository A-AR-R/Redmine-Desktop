import React, {Component, useState} from "react";
import Board from 'react-trello'
import "../css/AgileStyle.css";
import isEmpty from "lodash/isEmpty";
import axios from "axios";
import mainContext from "../UserContext";
import {makeStyles} from "@material-ui/core/styles";
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import ReactMarkdown from "react-markdown";
import * as Showdown from "showdown";
import styled, {createGlobalStyle, css} from 'styled-components'

const MyScrollableLane = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  align-self: center;
  width:100%;
  max-height: 90vh;
  margin-top: 10px;
  flex-direction: column;
  justify-content: space-between;
`

const MyCard = props => {
    const [selectedTab, setSelectedTab] = React.useState("preview");
    const [state, setState] = useState(props)
    const {mainState, setMainState} = React.useContext(mainContext);

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    const handleTabChange = (tab) => {
        setSelectedTab(tab)
        if (tab === 'preview') {
            axios({
                method: 'put',
                url: "http://" + mainState.serverName + "/issues/" + state.id + ".json",
                data: {
                    "issue": {
                        "description": state.description,
                    }
                },
                responseType: 'json',
                dataType: 'json',
                headers: {
                    "Access-Control-Allow-Headers": "X-Requested-With",
                    'X-Redmine-API-Key': mainState.token_id,
                    'Access-Control-Allow-Origin': '*'
                }
            }).then(res => {
                    console.log(res)

                }
            )
        }
    }

    const handleChange = (content) => {
        setState({
            ...state,
            description: content
        });
    }

    return (
        <div style={{border: '1px solid', minWidth: 'unset'}}>
            <header
                style={{
                    borderBottom: '1px solid #eee', height: "3rem",
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                    background: props.cardColor, padding:"5px"
                }}
            >
                <div style={{fontSize: 14, fontWeight: 'bold'}}>{props.title}</div>
                <div style={{fontSize: 11}}>{props.label}</div>
            </header>
            <div style={{fontSize: 12, color: '#BD3B36'}}>
                <ReactMde
                    value={state.description}
                    onChange={handleChange}
                    selectedTab={selectedTab}
                    onTabChange={handleTabChange}
                    generateMarkdownPreview={markdown =>
                        Promise.resolve(converter.makeHtml(markdown))
                    }
                    childProps={{
                        writeButton: {
                            tabIndex: -1
                        }
                    }}
                />

            </div>
        </div>
    )
}

const components = {
    ScrollableLane: MyScrollableLane,
    Card: MyCard,
};

class AgileBoard extends Component {
    static contextType = mainContext
    eventBus = undefined

    setEventBus = (handle) => {
        this.eventBus = handle
    }

    state = {
        data: {},
        load: false
    };

    constructor(props) {
        super(props);
        this.eventBus = undefined;
        this.state = {
            data: {},
            load: false
        }

    }

    onCardMoveAcrossLanes = (fromLaneId, toLaneId, cardId, index) => {
        console.log(fromLaneId, toLaneId, cardId, index)
        // var self = this;
        // 2875b029a6a87c9b3b7f04fd207a9b8386c78172
        axios({
            method: 'put',
            url: "http://" + this.context.mainState.serverName + "/issues/" + cardId + ".json",
            data: {
                "issue": {
                    "status_id": toLaneId,
                }
            },
            responseType: 'json',
            dataType: 'json',
            headers: {
                "Access-Control-Allow-Headers": "X-Requested-With",
                'X-Redmine-API-Key': this.context.mainState.token_id,
                'Access-Control-Allow-Origin': '*'
            }

        }).then(res => {
                console.log(res)

            }
        )
    }

    componentDidMount() {
        var self = this;
        self.getStatuses();
    };

    getStatuses = () => {

        var self = this;
        axios({
            method: 'get',
            url: "http://" + this.context.mainState.serverName + "/issue_statuses.json",
            responseType: 'json',
            dataType: 'json',
            headers: {
                "Access-Control-Allow-Headers": "X-Requested-With",
                'X-Redmine-API-Key': this.context.mainState.token_id,
                'Access-Control-Allow-Origin': '*'
            }

        }).then(res => {
                console.log(res.data.issue_statuses)
                var data = {
                    lanes: []
                }
                let colors = ['#2196F3', '#BA68C8', '#43A047']
                let count = res.data.issue_statuses.length
                res.data.issue_statuses.forEach(function (issue_status) {
                    data.lanes.push({
                        id: issue_status.id.toString(),
                        title: issue_status.name,
                        //FIXME remove hardcoded window size(960)
                        style: {
                            width: (960 / count) + 'px',
                            backgroundColor: 'transparent',
                            border: '1px solid ' + colors.pop()
                        },
                        cards: []
                    })
                })
                this.setState({data});
                self.getTodos();
            }
        )
    }

    getTodos = () => {
        var self = this;
        // 2875b029a6a87c9b3b7f04fd207a9b8386c78172
        axios({
            method: 'get',
            url: 'http://' + this.context.mainState.serverName + '/issues.json',
            params: {
                assigned_to_id: this.context.mainState.user_id
            },
            responseType: 'json',
            dataType: 'json',
            headers: {
                "Access-Control-Allow-Headers": "X-Requested-With",
                'X-Redmine-API-Key': this.context.mainState.token_id,
                'Access-Control-Allow-Origin': '*'
            }

        }).then(res => {
                let colors = ['#00CC6A', '#FF8C00', '#E74856']
                res.data.issues.forEach(function (issue) {
                    console.log(issue.priority.id)
                    self.eventBus.publish({
                        type: 'ADD_CARD',
                        laneId: issue.status.id.toString(),
                        card: {
                            id: issue.id.toString(),
                            title: issue.subject,
                            label: issue.tracker.name,
                            description: issue.description,
                            cardColor: colors[issue.priority.id-1]
                        }
                    })
                })

            }
        )
    };

    render() {
        const {data} = this.state;
        return (
            <div className="height650 ">
                {!isEmpty(data) ?
                    <Board style={{backgroundColor: 'whitesmoke', textAlign: 'left', width: '100%'}}
                           className="height100" data={data}
                           components={components}
                           onCardMoveAcrossLanes={this.onCardMoveAcrossLanes}
                           eventBusHandle={this.setEventBus} draggable/> : <p>Loading...</p>}
            </div>
        );
    }
}

export default AgileBoard;


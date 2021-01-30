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

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
    }
}));
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
        if(tab==='preview'){
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
                }}).then(res => {
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
        <div>
            <header
                style={{
                    borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 10,
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                    color: props.cardColor
                }}
            >
                <div style={{fontSize: 14, fontWeight: 'bold'}}>{props.title}</div>
                <div style={{fontSize: 11}}>{props.label}</div>
            </header>
            <div style={{fontSize: 12, color: '#BD3B36'}}>
                <div style={{color: '#4C4C4C', fontWeight: 'bold'}}>{props.subTitle}</div>
                <div style={{padding: '5px 0px'}}><i>{props.body}</i></div>
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
                res.data.issue_statuses.forEach(function (issue_status) {
                    data.lanes.push({
                        id: issue_status.id.toString(),
                        title: issue_status.name,
                        style: {width: 280},
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
            url: 'http://185.8.172.29:8084/issues.json',
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
                res.data.issues.forEach(function (issue) {
                    self.eventBus.publish({
                        type: 'ADD_CARD',
                        laneId: issue.status.id.toString(),
                        card: {
                            id: issue.id.toString(),
                            title: issue.subject,
                            label: issue.tracker.name,
                            description: issue.description
                        }
                    })
                })

            }
        )
    };

    render() {
        const {data} = this.state;
        return (
            <div className="height100">
                {!isEmpty(data) ? <Board style={{textAlign:'left'}} className="height100" data={data} components={components}
                                         onCardMoveAcrossLanes={this.onCardMoveAcrossLanes}
                                         eventBusHandle={this.setEventBus} draggable/> : <p>Loading...</p>}
            </div>
        );
    }
}

export default AgileBoard;


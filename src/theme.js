import { createMuiTheme } from '@material-ui/core/styles';


export const Theme = createMuiTheme({
	palette: {
		 background: {
			  default: "#c9ced4",
			  paper: "#e5e5e5"
		 }
	},
	typography: {
		fontSize: 13,
  },
	props: {
		 MuiCard: {
			  elevation: 4
		 },
		 MuiTextField: {
			  variant: "outlined"
		 },
		 MuiChip:{
			  color:'primary'
		 }
	},
});
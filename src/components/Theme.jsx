import { createMuiTheme} from '@material-ui/core/styles';
const Theme = createMuiTheme({
 overrides: {
    MuiOutlinedInput: {
        multiline: {
            fontWeight: 'bold',
            // fontSize: '20px',
            // color: 'purple',
        }
    }
}
  
});
export default Theme;
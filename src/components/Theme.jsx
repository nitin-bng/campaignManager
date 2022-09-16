// import { createMuiTheme } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles'
const Theme = createTheme({
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
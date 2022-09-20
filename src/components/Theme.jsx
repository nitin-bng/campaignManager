import { createTheme } from '@material-ui/core/styles'

const Theme = createTheme({
 overrides: {
    MuiOutlinedInput: {
        multiline: {
            fontWeight: 'bold',           
        }
    }
}
  
});
export default Theme;
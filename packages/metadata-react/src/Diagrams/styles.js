/**
 * ### Диаграмма
 * стили оформления
 *
 * Created by Evgeniy Malyarov on 16.08.2018
 */

import {withStyles} from '@mui/styles';

const styles = theme => ({
  flex: {
    flex: 1,
    paddingTop: theme.spacing(),
  },
  container: {
    display: 'flex',
    '& h3': {
      margin: [0, '!important'],
    }
  },
  root: {
    width: '100%',
    overflow: 'auto',
  },
  table: {
    minWidth: 300,
  },
  cellBody: {
    fontSize: 'inherit',
    padding: '4px 8px!important',
  },
  rowRoot: {
    height: 'auto'
  },
  darkblue: {
    color: 'darkblue',
  },
  secondary: {
    marginTop: -theme.spacing(1.5),
  },
  title: {
    marginLeft: theme.spacing(),
    fontSize: '1.1rem',
  },
  height: {
    position: 'relative',
    overflow: 'auto',
    maxHeight: 'calc(100vh - 160px)',
    minWidth: 260,
  },
  expansion: {
    padding: 0,
  },
  summary: {
    minHeight: '24px!important',
  },
  summaryCont: {
    margin: '8px 0!important',
  },
  padding7: {
    padding: 7,
  }
});

export default withStyles(styles);

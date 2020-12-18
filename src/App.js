import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Tracker from './tracker';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://time-tracker-server-kanishk.herokuapp.com/',
  cache: new InMemoryCache()
});

const App = () => (
   <ApolloProvider client={client}>
      <Tracker/>
    </ApolloProvider>
);

export default App;
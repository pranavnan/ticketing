// import buildClient from '@/api/buildClient';

import Link from 'next/link';

function LandingPage({ currentUser = null, tickets = [] }) {
  const ticketList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}$</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          View
        </Link>
        {/* This is called as wildcard route, we have to `Link` and `as` */}
        {/* href => for pointing out the file we want te render if we click on view */}
        {/* as => this is the url we are seeing in the browser */}
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>

        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  console.log('LandingPage.getInitialProps called');
  const response = await client.get('/api/tickets');
  return { tickets: response.data };
  // try {
  //   const response = await buildClient(context).get('/api/users/currentuser');
  //   return response.data;
  // } catch (err) {
  //   console.log({ 'LandingPage.getInitialProps': err });
  //   return {}
  // }
};

/*
// video 231 folder no 11
// this will fetch the data in the server side rendering
// whenever getInitialProps called on the server, the first argument to the function is an object which has a couple of different properties inside of it, eg => req object its like an request object received in an express application
LandingPage.getInitialProps = async ({ req }) => {
  // console.log(req.headers);
  console.log('LandingPage.getInitialProps I am on the server');

  // whether this request make from browser or server side render
  if (typeof window === 'undefined') {
    // `window` is the object thats only exists inside the browser, not in the Node.js environment
    // so if window object is undefined then we are in Node.js environment
    // request to be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

    const response = await axios
      .get(
        // `http://<SERVICENAME>.<NAMESPACE>.svc.cluster.host`
        `http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser`,
        {
          headers: req.headers
        },
      )
      .catch(err => console.dir({ err_30: err.response.data }, { depth: null }));

    console.log({ response_33: response });

    return response.data;
  } else {
    // we are on the browser, and we can make the request to the base url

    const { data } = await axios.get('/api/users/currentuser');
    // { currentUser: { id, email } } || { currentUser: null }
    return data;
  }

  // return {}
};
*/
export default LandingPage;

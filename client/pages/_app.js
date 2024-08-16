import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '@/api/buildClient';
import Header from '@/components/header';
// import LandingPage from "@/pages/index";

// this is going to wrap up our page
// This component is responsible for rendering each of the different pages that we are going to create over time.
export default function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
      {/* this is our actual page */}
    </div>
  );
}

// The getInitialProps props for the page and CustomApp is different
// In the page we are getting a context object context === { req, res }
// In the custom app we are getting a context === { Component, ctx: { req, res } }
// If we add the getInitialProps on App then the children of this AppComponent getInitialProps will not be called automatically we have to do it manually using the below appContext object we have the access to the Component Component: [Function: LandingPage] {
// [client]     getInitialProps: [AsyncFunction (anonymous)]
// [client]   },
AppComponent.getInitialProps = async appContext => {
  // console.log('AppComponent.getInitialProps called', appContext);

  try {
    const client = buildClient(appContext.ctx);
    const response = await client.get('/api/users/currentuser');
    // executing getInitialProps function manually as next will not call automatically as we defined the getInitialProps on main AppComponent
    let pageProps = {};

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(
        appContext.ctx,
        client,
        response.data.currentUser
      );
    }

    console.log({ pageProps });
    return {
      pageProps,
      ...response.data, // response.data.currentUser,
    };
  } catch (err) {
    console.log({ 'LandingPage.getInitialProps': err.message });
    return {};
  }
};

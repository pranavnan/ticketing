import axios from 'axios';

const buildClient = ({ req }) => {

  // whether this request make from browser or server side render
  if(typeof window === 'undefined') {
    // `window` is the object thats only exists inside the browser, not in the Node.js environment
    // so if window object is undefined then we are in Node.js environment
    // request to be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

    // create a preconfigured version of the axios, once we return this axios its like a normal axios client but with the baseUrl
    return axios.create({
      // `http://<SERVICENAME>.<NAMESPACE>.svc.cluster.host`
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    })
  } else {
    // we must be on browser
    return axios.create({
      baseURL: '/',
      // no need to includes header because the browser will take care of these headers and baseURL, we can remove the baseURL also and pass the empty object.
    })
  }
};

export default buildClient;
var  propertiesReader  = require('properties-reader')
const fetch = require('node-fetch');

var properties = propertiesReader('application.properties');

const client_id= properties.get('client_id');
const client_secret= properties.get('client_secret');
const projectKey= properties.get('project_key');
const api_url= properties.get('api_url');
const auth_url= properties.get('auth_url');
const authHeader = properties.get('authorization');
const host = properties.get('host');
const apiHost= properties.get('apiHost')
const activeCategoryUrl=properties.get('activeCategoryUrl');


//Content

const contentsUrl=properties.get('contentsUrl');
const contentUrl=properties.get('contentUrl');



//console.log(properties.get("client_id"));
console.log('client_id' + client_id);
console.log('client_secret' + client_secret);
console.log('projectKey' + projectKey);
console.log('api_url' + api_url);
console.log('auth_url' + auth_url);
console.log('authHeader ' + authHeader);
console.log('host ' + host);




let headers = {
    'Content-Type': 'application/json',
    'Authorization' : authHeader,
    'Host' : host
};

let accessToken = '';
  
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const contentResolvers = {
    Content: {
        __resolveReference(ref,args,context,info) {
            console.log('inside content reference container' + ' key = '+ ref.id);
            let passthroughAccessToken = '';
              
              
              
              if (args && args.req && args.req.headers && args.req.headers.xauthorization) {
                passthroughAccessToken = args.req.headers.xauthorization;
              }
              console.log('authorization token'+passthroughAccessToken);
                let contentUrlupdated = contentUrl+ref.id;
    
                      let categoryHeaders = {
                          'Content-Type': 'application/json',
                          'Authorization' : passthroughAccessToken,
                      };
                      return fetch(contentUrlupdated, {method: 'GET', headers: categoryHeaders}).then(res => res.json()).then(json => {
                        console.log('content JSON: ' + json);
                        return json;
                      });
                      //return {"name": "1234", "key":"key1", "container": "container1"};
        }
    },
    Query: {
        contents: (parent, args, context, info) => {
            console.log('inside contents ');
              console.log('authorization token'+context.req.headers.xauthorization);
              let passthroughAccessToken = '';
              if (context.req && context.req.headers && context.req.headers.xauthorization) {
                passthroughAccessToken = context.req.headers.xauthorization
              }
              
                      let categoryHeaders = {
                          'Content-Type': 'application/txt',
                          'Authorization' : passthroughAccessToken,
                      };
                      return fetch(contentsUrl, {method: 'GET', headers: categoryHeaders}).then(res => res.json()).then(json => {
                        console.log('contents JSON: ' +json);
                        return json;
                      });
          },  
          content: (parent, {key}, context, info) => {
            console.log('inside content container' + container + ' key = '+ key);
              console.log('authorization token'+context.req.headers.xauthorization)
              let passthroughAccessToken = '';
              if (context.req && context.req.headers && context.req.headers.xauthorization) {
                passthroughAccessToken = context.req.headers.xauthorization
              }
                let contentUrlupdated = contentUrl+key;
    
                      let categoryHeaders = {
                          'Content-Type': 'application/txt',
                          'Authorization' : passthroughAccessToken,
                      };
                      return fetch(contentUrlupdated, {method: 'GET', headers: categoryHeaders }).then(res => res.json()).then(json => {
                        console.log('content JSON: ' + json);
                        return json;
                      });
          }
        }
  };

  const obtainTokenUrl = auth_url+'/oauth/token?grant_type=client_credentials';
  let queryCategories = api_url+'/'+projectKey+'/categories';
  let queryParameters = '?where=parent%20is%20not%20defined&limit=100'

  let queryCategory = api_url+'/'+projectKey+'/categories/';
  
  console.log(obtainTokenUrl);

retrieveAccessToken = () => {
    fetch(obtainTokenUrl, {
    method: 'POST',
    body: {},
    headers: headers
}).then(res => res.json())
  .then(json => {
      console.log(json);
      if (json.access_token) {
        accessToken = 'Bearer '+ json.access_token;
        console.log('retrieved access token to be used for Commerce tools calls' + accessToken)    
      }
      
    });
}

retrieveCategories = () => {
    let categoryUrl = queryCategories + queryParameters;
    console.log('inside retrieveCategories, accesstoken - ' + accessToken);
    let categoryHeaders = {
        'Content-Type': 'application/json',
        'Authorization' : accessToken,
        'Host' : host
    };
    fetch(categoryUrl, {method: 'GET', headers: categoryHeaders}).then(res => res.json())
  .then(json => {
      console.log(json);
      if (json.access_token) {
        accessToken = 'Bearer '+ json.access_token;
        console.log('retrieved access token to be used for Commerce tools calls')    
      }
      
    });
}

retrieveAccessToken();


  module.exports = {contentResolvers} ;
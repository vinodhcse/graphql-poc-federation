const { ApolloServer, gql } = require('apollo-server');
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

const txt = '{"limit":20,"offset":0,"count":6,"total":6,"results":[{"id":"776f1de9-4be4-411f-9f4c-cfbcb6d89268","version":8,"lastMessageSequenceNumber":1,"createdAt":"2022-01-12T20:49:43.829Z","lastModifiedAt":"2022-01-13T19:14:17.982Z","lastModifiedBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"createdBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"key":"makeup","name":{"de-DE":"MakeUp","en-GB":"Make","en-US":"Make Up","en-CA":"Make Up","fr-CA":"Maquillage"},"slug":{"de-DE":"makeup"},"description":{"de-DE":"Make Up","en-GB":"makeup","en-US":"makeup","en-CA":"makeup","fr-CA":"makeup"},"ancestors":[],"orderHint":"0.1","externalId":"makeup","assets":[]},{"id":"b9c1fcda-61de-47f6-95b2-add1a4f4aa9f","version":3,"lastMessageSequenceNumber":1,"createdAt":"2022-01-12T21:00:24.427Z","lastModifiedAt":"2022-01-13T19:14:18.005Z","lastModifiedBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"createdBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"key":"hair","name":{"de-DE":"Hair","en-US":"Hair","en-CA":"Hair"},"slug":{"de-DE":"hair"},"description":{"de-DE":"hair"},"ancestors":[],"orderHint":"0.4","externalId":"hair","assets":[]},{"id":"dfca5796-802e-43a5-af4d-606df677c0b0","version":3,"lastMessageSequenceNumber":1,"createdAt":"2022-01-13T02:35:05.689Z","lastModifiedAt":"2022-01-21T07:18:04.228Z","lastModifiedBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"createdBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"key":"fragrance","name":{"en-US":"Fragrance"},"slug":{"en-US":"fragrance"},"description":{"en-US":"fragrance"},"ancestors":[],"orderHint":"0.2","externalId":"fragrance","assets":[]},{"id":"adccf789-d19e-4585-b7f5-0a0e93048357","version":3,"lastMessageSequenceNumber":1,"createdAt":"2022-01-13T06:35:00.216Z","lastModifiedAt":"2022-01-21T07:18:14.314Z","lastModifiedBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"createdBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"key":"bath","name":{"en-US":"Bath & Body"},"slug":{"en-US":"bath-body"},"description":{"en-US":"bath and body"},"ancestors":[],"orderHint":"0.3","externalId":"bath","assets":[]},{"id":"95dddd33-62d7-4b5a-b343-5b622907c5bf","version":3,"lastMessageSequenceNumber":1,"createdAt":"2022-01-13T07:31:01.528Z","lastModifiedAt":"2022-01-21T07:18:23.314Z","lastModifiedBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"createdBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"key":"new","name":{"en-US":"New"},"slug":{"en-US":"new"},"description":{"en-US":"new"},"ancestors":[],"orderHint":"0.5","externalId":"new","assets":[]},{"id":"2b82cbe2-c127-4dfa-8a1d-d621109315df","version":2,"lastMessageSequenceNumber":1,"createdAt":"2022-01-13T20:02:35.218Z","lastModifiedAt":"2022-01-21T07:17:51.627Z","lastModifiedBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"createdBy":{"isPlatformClient":true,"user":{"typeId":"user","id":"d17fa008-c034-4279-a3d1-d09368723f57"}},"key":"skincare","name":{"en-US":"Skin Care"},"slug":{"en-US":"skin-care"},"ancestors":[],"orderHint":"0.05","externalId":"skincare","assets":[]}]}'
const categories = JSON.parse(txt);

const categories1 = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];
  
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Category:{
        children(category, args, context, info) {
            console.log('parent in children:' + category.id);
            console.log('parent in children1:');
                let categoryQueryParameters1 = '?where=parent(id%3d"'+ category.id  +'")&limit=100';
                console.log('parent in children:');
                let categoryUrl1 = queryCategories + categoryQueryParameters1;
                console.log('parent in children2:');
                console.log('inside rchild category url ' + categoryUrl1);
                  let categoryHeaders = {
                      'Content-Type': 'application/json',
                      'Authorization' : accessToken,
                      'Host' : apiHost
                  };
                  return fetch(categoryUrl1, {method: 'GET', headers: categoryHeaders}).then(res => res.json()).then(json => {
                    //console.log(json);
                    
                    if (json && json.count > 0 && json.results) {
                        console.log('retrieved categroy from service, count :' + json.count);
                        return json.results;
                        
                    }  else {
                        console.log('Empty retrieved categroy from service')
                        return null;
                    }
                    
                  });
        },
        name(category, args, context, info) {
          console.log('inside name category '+ category + 'args' + args.locale)
          if (category && category.name && args.locale && category.name[args.locale]) {
            console.log('inside name category.name '+ category.name + ' name '+ category.name[args.locale])
            return category.name[args.locale];
          } else {
            return null;
          }
          
        },
        active(category, args, context, info) {
          console.log('inside active category '+ category.id )
          console.log(context.req.headers.authorization)
          let passthroughAccessToken = '';
          if (context.req && context.req.headers && context.req.headers.authorization) {
            passthroughAccessToken = context.req.headers.authorization
          }
          let activeCategoryUrls = activeCategoryUrl + category.id;
                  let categoryHeaders = {
                      'Content-Type': 'application/txt',
                      'Authorization' : passthroughAccessToken,
                  };
                  return fetch(activeCategoryUrls, {method: 'GET'}).then(res => res.json()).then(json => {
                    console.log(json);
                    
                    if (json && json.categoryStatus) {
                        return json.categoryStatus;
                    }  else { 
                        return 'inActive';
                    }
                    
                  });
        },
        content(category, args, context, info) {
          console.log('inside content category '+ category.id )
          console.log(context.req.headers.authorization)
          let passthroughAccessToken = '';
          if (context.req && context.req.headers && context.req.headers.authorization) {
            passthroughAccessToken = context.req.headers.authorization
          }
            let contentUrlupdated = contentUrl+category.id+'_content';

                  let categoryHeaders = {
                      'Content-Type': 'application/txt',
                      'Authorization' : passthroughAccessToken,
                  };
                  return fetch(contentUrlupdated, {method: 'GET'}).then(res => res.json()).then(json => {
                    console.log('content JSON for category: ' + json);
                    return json;
                  });
        }

    },
    Query: {
        categories: (parent, args, context, info) => {
          console.log('parent :' + parent);
          console.log('args :' + args);
          console.log('context :' + context);
          console.log('info :' + info);

            let categoryUrl = queryCategories + queryParameters;
            console.log('inside retrieveCategories');
            let categoryHeaders = {
                'Content-Type': 'application/json',
                'Authorization' : accessToken,
                'Host' : apiHost
            };
            return fetch(categoryUrl, {method: 'GET', headers: categoryHeaders}).then(res => res.json());

      },

      contents: (parent, args, context, info) => {
        console.log('inside contents ');
          console.log('authorization token'+context.req.headers.authorization);
          let passthroughAccessToken = '';
          if (context.req && context.req.headers && context.req.headers.authorization) {
            passthroughAccessToken = context.req.headers.authorization
          }
          
                  let categoryHeaders = {
                      'Content-Type': 'application/txt',
                      'Authorization' : passthroughAccessToken,
                  };
                  return fetch(contentsUrl, {method: 'GET'}).then(res => res.json()).then(json => {
                    console.log('contents JSON: ' +json);
                    return json;
                  });
      },  
      content: (parent, {key}, context, info) => {
        console.log('inside content container' + container + ' key = '+ key);
          console.log('authorization token'+context.req.headers.authorization)
          let passthroughAccessToken = '';
          if (context.req && context.req.headers && context.req.headers.authorization) {
            passthroughAccessToken = context.req.headers.authorization
          }
            let contentUrlupdated = contentUrl+key;

                  let categoryHeaders = {
                      'Content-Type': 'application/txt',
                      'Authorization' : passthroughAccessToken,
                  };
                  return fetch(contentUrlupdated, {method: 'GET'}).then(res => res.json()).then(json => {
                    console.log('content JSON: ' + json);
                    return json;
                  });
      }
    },
  };

  const obtainTokenUrl = auth_url+'/oauth/token?grant_type=client_credentials';
  let queryCategories = api_url+'/'+projectKey+'/categories';
  let queryParameters = '?where=parent%20is%20not%20defined&limit=100'
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


  module.exports = {resolvers} ;
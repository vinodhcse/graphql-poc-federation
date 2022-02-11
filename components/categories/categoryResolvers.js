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
const categoryResolvers = {
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
          console.log(context.req.headers.xauthorization)
          let passthroughAccessToken = '';
          if (context.req && context.req.headers && context.req.headers.xauthorization) {
            passthroughAccessToken = context.req.headers.xauthorization
          }
          let activeCategoryUrls = activeCategoryUrl + category.id;
                  let categoryHeaders = {
                      'Content-Type': 'application/json',
                      'Authorization' : passthroughAccessToken,
                  };
                  return fetch(activeCategoryUrls, {method: 'GET', headers: categoryHeaders}).then(res => res.json()).then(json => {
                    console.log(json);
                    
                    if (json && json.categoryStatus) {
                        return json.categoryStatus;
                    }  else { 
                        return 'inActive';
                    }
                    
                  });
        },
        content(category, args, context, info) {
          console.log('inside content category '+ category.id + ' token :' + context.req.headers.xauthorization);
          let passthroughAccessToken = '';
          if (context.req && context.req.headers && context.req.headers.xauthorization) {
            passthroughAccessToken = context.req.headers.xauthorization
          }
          console.log(context.req.headers.xauthorization)
          let categoryIdWithToken = category.id +'_content' /*+ '_*_' + passthroughAccessToken*/;
          let typeJson = {"_typename":"Content", "id": categoryIdWithToken, "token1": passthroughAccessToken};            
          return typeJson;
          /*console.log(context.req.headers.authorization)

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
                  });*/
        }

    },
    Query: {
        categories: (parent, args, context, info) => {
          console.log('parent :' + parent);
          console.log('args :' + args);
          console.log('context :' + context);
          console.log('info :' + info);

            let categoryUrl = queryCategory + queryParameters;
            console.log('inside retrieveCategories');
            let categoryHeaders = {
                'Content-Type': 'application/json',
                'Authorization' : accessToken,
                'Host' : apiHost
            };
            return fetch(categoryUrl, {method: 'GET', headers: categoryHeaders}).then(res => res.json());

      },
      category: (parent, { id }, context, info) => {
        console.log('retreiving category  :' + id);
          let categoryUrl = queryCategory + id;
          console.log('inside retrieveCategories');
          let categoryHeaders = {
              'Content-Type': 'application/json',
              'Authorization' : accessToken,
              'Host' : apiHost
          };
          return fetch(categoryUrl, {method: 'GET', headers: categoryHeaders}).then(res => res.json());

    }
    },
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


  module.exports = {categoryResolvers} ;
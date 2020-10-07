//const NodeCache = require( "node-cache" );
//const myCache = new NodeCache( { stdTTL: 1000, checkperiod: 500 } );
//const connection = require(`./connection.js`);
const udf = require(`../udf/udf.js`);


//var tt = 'https://api.twitter.com/1.1/search/tweets.json?q=%40realdonaldtrump&src=typed_query&pf=on';

var tt = 'https://api.twitter.com/1.1/search/tweets.json?q=from:realdonaldtrump';

//get last time of twitter 
//var ttime = myCache.get('ttime');
//client.get('search/tweets', {q: 'from:realdonaldtrump'}, function(error, data, response) {
	
//	var qr = 'from:realdonaldtrump';//"?since_id=1167410616082010120&q=from%3Arealdonaldtrump&include_entities=1";
	var _sid = 1213689342272659456;
	var mitesh_sid = 1236981823990714369;


	function findTweets(client,user,con){
	return new Promise(function(resolve, reject){
	
	var qr = 'from:' + user;

	var a= [];
	var sql = `SELECT * FROM temp_db WHERE temp_for ='${user}'`;

	udf.querySQL(sql,con)
	.then(result=>{
		var sid = (result != 0 && typeof result != "undefined") ? result[0].temp_value : _sid;
		sid = result != 0 ? result[0].temp_value : user == 'realdonaldtrump' ? _sid : mitesh_sid;
		
		client.get('search/tweets', {q: qr,since_id:sid,tweet_mode:'extended'}, function(error, data, response) {
			
			//console.log(data.statuses);
			
			if(error) reject (error);

			if(!error){
				var t = Math.min(data.statuses.length, 10);
				
				if (t > 0){
					
					for(let i = t - 1 ; i > -1; i--){
						let id = data.statuses[i].id_str;
						if(id > sid){
							let time = String(new Date(data.statuses[i].created_at).toString()).split(' GMT')[0];//new Date(data.statuses[i].created_at).getTime();
							let text =  data.statuses[i]["retweeted_status"] ? data.statuses[i].full_text.split(':')[0] + " "  + data.statuses[i]["retweeted_status"]["full_text"] : data.statuses[i].full_text;
						
							a.push(['\n\n<b>Twitted at:' + time + '</b>\n' + text]);
						}
					}
					
					if(a.length > 0){
						resolve({msg:a.join('\n'),id:data.statuses[0].id_str});
					}	
				}
			}
						
		})
	})
	.catch(e =>{
		reject (e);
	})
})
}
		
module.exports = {
    findTweets
};
		
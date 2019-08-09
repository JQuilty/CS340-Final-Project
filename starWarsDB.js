var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'classmysql.engr.oregonstate.edu',
  user  : '',
  password: '',
  database: ''
});

//call the pool to start a connection
pool.query('select * from characters', function(err, result){
        if(err){
          next(err);
          return;
        }
        });


app.use(express.static('public')); 

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9945);


app.get('/',function(req,res){
  res.render('index');
});

app.get('/index',function(req,res){
  res.render('index');
});

app.get('/update',function(req,res){
	res.render('update'); 
}); 

app.get('/characters',function(req,res){
  
	var planet_list = []; 
	pool.query("SELECT * from planets",function(err,rows){
		if(err){
			next(err); 
			return; 
		}
		for (var p in rows){
			planet_list.push ({'name':rows[p].planet_name,'id':rows[p].planet_id}); 
		}
	});   

    var faction_list = []; 
	pool.query("SELECT * from factions",function(err,rows){
		if(err){
			next(err); 
			return; 
		}
		for (var p in rows){
			faction_list.push ({'name':rows[p].faction_name,'id':rows[p].faction_id}); 
			}
			var context = {}; 
  			context.pList = planet_list; 
 			context.fList = faction_list; 
 			res.render('characters',context);
	});   

  
});

app.get('/factions',function(req,res){
  res.render('factions');
});

app.get('/planets',function(req,res){
  
	res.render('planets');
});

app.get('/p_faction',function(req,res){
  
  var planet_list = []; 
	pool.query("SELECT * from planets",function(err,rows){
		if(err){
			next(err); 
			return; 
		}
		for (var p in rows){
			planet_list.push ({'name':rows[p].planet_name,'id':rows[p].planet_id}); 
		}
	});   

    var faction_list = []; 
	pool.query("SELECT * from factions",function(err,rows){
		if(err){
			next(err); 
			return; 
		}
		for (var p in rows){
			faction_list.push ({'name':rows[p].faction_name,'id':rows[p].faction_id}); 
			}
			var context = {}; 
  			context.pList = planet_list; 
 			context.fList = faction_list; 
 			res.render('p_faction',context);
	});
});

app.get('/vehicles',function(req,res){
  
	var context = {}; 
		var pilot_list = []; 
		pool.query("SELECT character_name, character_id from characters",function(err,rows){
			if(err){
				next(err); 
				return; 
			}
			for (var p in rows){
				pilot_list.push ({'name':rows[p].character_name,'id':rows[p].character_id}); 
			}
			context.pilots = pilot_list; 
			res.render('vehicles',context);
		}); 
});

//====================================
// handle posts from the character page
//====================================
app.post('/characters',function(req,res,next){
   
    if(req.body.action == "add"){
      
    pool.query("INSERT INTO characters (`character_name`, `character_origin`, `character_faction`, `character_role`) VALUES (?,?,?,?)", [req.body.name,req.body.origin,req.body.faction,req.body.role], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    } 

  else if(req.body.action == "delete"){
      pool.query("DELETE FROM characters WHERE character_id=?", [req.body.row], function(err, result){
      if(err){
        next(err);
        return;
      }
      res.send(null); 
      }); 
    }

  	else if(req.body.action == "get"){

  		if (req.body.table == "none"){	    
		    pool.query('SELECT * FROM characters LEFT JOIN planets on character_origin = planet_id '+
		    	'LEFT JOIN factions ON character_faction = faction_id ORDER BY character_id', function(err, rows, fields){
		      if(err){
		        next(err);
		        return;
		      }
		      res.type('application/json');
		      res.send(rows);
		    });
		}else{
			var data; 
			if(req.body.data == -1){
				data = " IS NULL"; 
			}
			else {
				data = " = " + JSON.stringify(req.body.data); 
			}
			pool.query('SELECT * FROM characters LEFT JOIN planets on character_origin = planet_id '+
		    	'LEFT JOIN factions ON character_faction = faction_id WHERE '+
		    	req.body.col + data + ' ORDER BY character_id', function(err, rows, fields){
		      if(err){
		        next(err);
		        return;
		      }
		      res.type('application/json');
		      res.send(rows);
		    });
		}
	}
	
	

  else if (req.body.action == "getFactionPlanets"){

  	pool.query('SELECT planet_id, planet_name, faction_id, faction_name FROM planets '+
				'LEFT JOIN '+
				'factions '+
				'ON planet_id = faction_id '+
				'UNION ALL '+
				'SELECT planet_id, planet_name, faction_id, faction_name '+
				'FROM planets '+
				'RIGHT JOIN '+
				'factions '+
				'ON planet_id = faction_id '+
				'WHERE planet_id IS NULL', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.type('application/json');
      res.send(rows);
      });

  }

  if(req.body.action == "save"){
      
    pool.query("UPDATE characters SET character_name = ?, character_faction = ?, character_origin=?, character_role = ? where character_id = ?", [req.body.name,req.body.faction,req.body.origin,req.body.role,req.body.id], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    }

 
});


//====================================
// handle posts from the planets page
//====================================
app.post('/planets',function(req,res,next){
   
    if(req.body.action == "add"){
      
    pool.query("INSERT INTO planets (planet_name, planet_population, planet_environment) VALUES (?,?,?)", [req.body.name,req.body.population,req.body.environment], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    } 

  else if(req.body.action == "delete"){
      pool.query("DELETE FROM planets WHERE planet_id=?", [req.body.row], function(err, result){
      if(err){
        next(err);
        return;
      }
      res.send(null); 
      }); 
    }

  else if(req.body.action == "get"){
    pool.query('SELECT planet_id, planet_name, planet_population, planet_environment FROM planets', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.type('application/json');
      res.send(rows);
    });
  }
	
  if(req.body.action == "save"){
      
    pool.query("UPDATE planets SET planet_name = ?, planet_population = ?, planet_environment=? where planet_id = ?", [req.body.name,req.body.population,req.body.environment,req.body.id], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    }
});

//====================================
// handle posts from the vehicle page
//====================================

app.post('/vehicles',function(req,res,next){
   
    if(req.body.action == "add"){
      
    pool.query("INSERT INTO vehicles (vehicle_name, vehicle_capacity, vehicle_lightspeed, vehicle_pilot) VALUES (?,?,?,?)", [req.body.name,req.body.capacity,req.body.lightspeed, req.body.pilot], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    } 

  else if(req.body.action == "delete"){
      pool.query("DELETE FROM vehicles WHERE vehicle_id=?", [req.body.row], function(err, result){
      if(err){
        next(err);
        return;
      }
      res.send(null); 
      }); 
    }

  else if(req.body.action == "get"){
    pool.query('SELECT vehicle_name, vehicle_capacity, vehicle_lightspeed, vehicle_pilot, vehicle_id, character_name, character_id FROM vehicles' +
    	' LEFT JOIN characters ON character_id = vehicle_pilot ORDER BY vehicle_id', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.type('application/json');
      res.send(rows);
    });
  }
	
  else if(req.body.action == "save"){
      
    pool.query("UPDATE vehicles SET vehicle_name=?, vehicle_capacity=?, vehicle_lightspeed=?, vehicle_pilot=? where vehicle_id = ?", [req.body.name,req.body.capacity,req.body.lightspeed,req.body.pilot,req.body.id], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    }

    
    else if (req.body.action == "getPilots"){

  	pool.query('SELECT character_id, character_name FROM characters', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.type('application/json');
      res.send(rows);
      });
  	}

});

//====================================
// handle posts from the factions page
//====================================
app.post('/factions',function(req,res,next){
   
    if(req.body.action == "add"){
      
    pool.query("INSERT INTO factions (faction_name, faction_goal, faction_size) VALUES (?,?,?)", [req.body.name,req.body.goal,req.body.size], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    } 

  else if(req.body.action == "delete"){
      pool.query("DELETE FROM factions WHERE faction_id=?", [req.body.row], function(err, result){
      if(err){
        next(err);
        return;
      }
      res.send(null); 
      }); 
    }

  else if(req.body.action == "get"){
    pool.query('SELECT * FROM factions', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.type('application/json');
      res.send(rows);
    });
  }
	
  if(req.body.action == "save"){
      
    pool.query("UPDATE factions SET faction_name=?, faction_goal=?, faction_size=? where faction_id = ?", [req.body.name,req.body.goal,req.body.size,req.body.id], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    }
});

//====================================
// handle posts from the planet/factions page
//====================================
app.post('/planetFactions',function(req,res,next){
   
    if(req.body.action == "add"){
      
    pool.query("INSERT INTO planet_factions (pid, fid) VALUES (?,?)", [req.body.planet,req.body.faction], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    } 

  else if(req.body.action == "delete"){
      pool.query("DELETE FROM planet_factions WHERE pid=? AND fid=?", [req.body.pid,req.body.fid], function(err, result){
      if(err){
        next(err);
        return;
      }
      res.send(null); 
      }); 
    }

  else if(req.body.action == "get"){
    pool.query('SELECT planet_id, planet_name, faction_id, faction_name FROM planet_factions INNER JOIN ' + 
    	'planets on planet_id = pid INNER JOIN factions on fid = faction_id ORDER BY pid', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.type('application/json');
      res.send(rows);
    });
  }
	
  if(req.body.action == "save"){
      
    pool.query("UPDATE planet_factions SET pid=?, fid=? WHERE fid=? AND pid=?", [req.body.planet,req.body.faction,req.body.oldFid,req.body.oldPid], function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(null); 
      });
    }
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

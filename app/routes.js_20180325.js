// app/routes.js
module.exports = function(app, passport) {
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var mysql = require('mysql');

var dbConfig = require('../config/database');
var dbOdontoConfig = require('../config/odonto_user');

	app.post('/', isLoggedIn, function(req, res) {
		indexPage(req, res);
	});

	app.get('/', isLoggedIn, function(req, res) {

		indexPage(req, res);
	});
	
	app.get('/filter', isLoggedIn, function(req, res) {
		
		var connection_users = mysql.createConnection(dbOdontoConfig.connection);
		connection_users.query('USE ' + dbOdontoConfig.database);

		var where_user = "WHERE 1=1 ";
			
		if(req.user.type == 1){
			where_user += ' and c.CodNac = b.cod and b.status = 1 and b.id="'+req.user.id+'" '
		}

		var queryUser = 
			'SELECT '+
				'CONCAT(SCE.ev," ",SCE.ea," ",SCE.aa) estruturaVenda,'+
				'SCE.diretorCodigo diretorCodigo,'+
				'UPPER(SCE.diretorNome) diretorNome, '+
				'SCE.gerenteCodigo gerenteCodigo, '+
				'UPPER(SCE.gerenteNome) gerenteNome, '+
				'SCE.representanteCodigo representanteCodigo, '+
				'UPPER(SCE.representanteNome) representanteNome, '+
				'SCE.id_corretora id_corretora, '+
				'UPPER(c.NomeProdutor) corretor_nome, '+
				'SCPE.id id_produtor, '+
				'UPPER(SCPE.produtor_nome) produtor_nome '+
			'FROM  '+
				'servus_corretor_estruturadevenda SCE  '+
				'LEFT JOIN servus_corretor_produtor_estruturadevenda SCPE ON SCE.ev=SCPE.ev AND SCE.ea=SCPE.ea AND SCE.aa=SCPE.aa  '+
				'LEFT JOIN servus_corretor_client c ON c.id = SCE.id_corretora '+
				'LEFT JOIN servus_corretor_dashboard b ON b.cod = c.CodNac  '+				
			where_user+
				'group by SCE.ev,SCE.ea,SCE.aa; ';

		console.log(queryUser);
		
		connection_users.query(queryUser, function(errUser, resultUsers, fieldsUsers) {
			if (errUser) throw errUser;

			res.send(JSON.stringify(resultUsers))
			

		});	
			

	});

	app.get('/midias', isLoggedIn, function(req, res) {
		var connection = mysql.createConnection(dbConfig.connection);
		connection.query('USE ' + dbConfig.database);

		var query = "select distinct corretor_type from ga_data";

		console.log(query);

		connection.query(query, function(err, result, fields) {
			if (err) throw err;

			res.send(JSON.stringify(result))
			

		});	
	})

	app.get('/regioes', isLoggedIn, function(req, res) {
		var connection = mysql.createConnection(dbConfig.connection);
		connection.query('USE ' + dbConfig.database);

		var query = "select distinct regiao from ga_data where trim(regiao) <> ''";

//		console.log('-------regioes:'+query+'-------');

		connection.query(query, function(err, result, fields) {
			if (err) throw err;

			res.send(JSON.stringify(result))
			

		});	
	})

	
	app.get('/metricas', isLoggedIn, function(req, res) {
		
		var connection = mysql.createConnection(dbConfig.connection);
		connection.query('USE ' + dbConfig.database);

		var connection_users = mysql.createConnection(dbOdontoConfig.connection);
		connection_users.query('USE ' + dbOdontoConfig.database);
		
		//var whereFoundFilter = 'where 1=1 ';
		var whereFoundFilter = '';
		
		if(req.param("filterDiretor"))
			whereFoundFilter += 'and SCE.diretorCodigo="'+req.param("filterDiretor")+'" '

		if(req.param("filterGerente"))
			whereFoundFilter += 'and SCE.gerenteCodigo="'+req.param("filterGerente")+'" '

		if(req.param("filterRepresentante"))
			whereFoundFilter += 'and SCE.representanteCodigo="'+req.param("filterRepresentante")+'" '

		if(req.param("filterCorretora"))
			whereFoundFilter += 'and SCE.id_corretora="'+req.param("filterCorretora")+'" '

		if(req.param("filterProdutor"))
			whereFoundFilter += 'and SCPE.id="'+req.param("filterProdutor")+'" '

		if(req.user.type == 1)
			whereFoundFilter += ' and c.CodNac = b.cod and b.status = 1 and b.id="'+req.user.id+'" '

		//console.log(whereFoundFilter);
		var queryFoundFilter = 
			'SELECT '+
				'CONCAT(SCE.ev," ",SCE.ea," ",SCE.aa) estruturaVenda '+
			'FROM  '+
				'servus_corretor_estruturadevenda SCE '+
				'LEFT JOIN servus_corretor_client c ON c.id = SCE.id_corretora '+
				'LEFT JOIN servus_corretor_produtor_estruturadevenda SCPE ON SCE.ev=SCPE.ev AND SCE.ea=SCPE.ea AND SCE.aa=SCPE.aa  '+
				'LEFT JOIN servus_corretor_dashboard b ON b.cod = c.CodNac  '+
			'WHERE '+
				'c.id = SCE.id_corretora '+
			whereFoundFilter +
			' group by SCE.ev,SCE.ea,SCE.aa; '
			
		;
		
		//console.log(queryFoundFilter);
		
		connection_users.query(queryFoundFilter, function(errFoundFilter, rowsFoundFilter, fieldsFoundFilter) {
			if (errFoundFilter) throw errFoundFilter;

			var dates = req.param("datas");
			var now = new Date();
			var where_ga = "WHERE 1=1 ";
			var where_vida = "WHERE 1=1 ";
			var where_user = "WHERE 1=1 ";
			
			if(req.user.type == 1){
				if (rowsFoundFilter.length > 0){
					where_user += ' AND(';
					for (var i in rowsFoundFilter) {
						where_user += ' CONCAT(SCE.ev," ",SCE.ea," ",SCE.aa) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
					}
					where_user = where_user.substr(0, where_user.length-3)+')';
				}
			}
			//console.log(req.param("filterDiretor"));
			if(req.user.type == 1 || 
				(
					req.param("filterDiretor") !='' || 
					req.param("filterGerente") !='' || 
					req.param("filterRepresentante") !='' || 
					req.param("filterCorretora") !='' || 
					req.param("filterProdutor") !='' 
				)
			){
				if (rowsFoundFilter.length > 0){
					where_ga += ' AND(';
					where_vida += ' AND(';
					for (var i in rowsFoundFilter) {
						where_ga += ' CONCAT(ev," ",ea," ",aa) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
						where_vida += ' CONCAT(ev_selecionado," ",ea_selecionado," ",aa_selecionado) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
					}
					where_ga = where_ga.substr(0, where_ga.length-3)+')';
					where_vida = where_vida.substr(0, where_vida.length-3)+')';	
				}			
			}
			//console.log(req.param("filterProdutor"));
			
			if(dates){
				var dates_array = dates.split(" - ");
				var part = dates_array[0].split('/');
				var fromDate = part[2]+'-'+part[1]+'-'+part[0];
				part = dates_array[1].split('/');
				var toDate = part[2]+'-'+part[1]+'-'+part[0];
			}
			
			if(fromDate != undefined && toDate != undefined){
				where_ga += " AND ga.date >= '"+fromDate+"' AND ga.date <= '"+toDate+"' ";
				where_vida += " AND date_finish >= '"+fromDate+" 00:00:00' AND date_finish <= '"+toDate+" 23:59:59' ";
			}else{
				where_ga += " AND ga.date >= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-01' AND ga.date <= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"' ";
				where_vida += " AND date_finish >= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-01' AND date_finish <= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"' ";
				dates =  "01/"+(now.getMonth()+1)+"/"+now.getFullYear()+" - "+(now.getDate()-1)+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
			}
			
			if(req.param("filterMidia")) {
				var midias = req.param("filterMidia").split(",");
				for (var i = 0; i < midias.length; i++) {
					midias[i] = "'" + midias[i] + "'";
				}
				where_ga += ' AND ga.corretor_type in ('+midias.join(",")+') ';
			}

			if(req.param("filterRegiao")) {
				var regioes = req.param("filterRegiao").split(",");
				for (var i = 0; i < regioes.length; i++) {
					regioes[i] = "'" + regioes[i] + "'";
				}
				where_ga += ' AND ga.regiao in ('+regioes.join(",")+') ';
			}

			
			var limit_date = (now.getDate()-1)+"/"+(now.getMonth()+1)+"/"+now.getFullYear()
			//where = " where date >= '2017-07-01' AND date <= '2018-07-10' ";
			
			var data = {};

					
				
			var queryGA = 
					'SELECT  '+
						'SUM(ga.sessions) as sessions,  '+
						'SUM(ga.impressions) as impressions,  '+
						'SUM(ga.adClicks) as adClicks,  '+
						'SUM(ga.adCost) as adCost,  '+
						'SUM(ga.goal1Completions) as precadastro, '+
						'SUM(ga.goal2Completions) as dependentes, '+
						'SUM(ga.goal3Completions) as dadospessoais, '+
						'SUM(ga.goal4Completions) as corretor, '+
						'pd.vidas as vidas, '+
						'pd.vendas as comprasfinalizada, '+
						'SUM(ga.goal6Completions) as checkout, '+
						'SUM(ga.transactionRevenue) as transactionRevenue, '+
						'SUM(ga.transactions) as transactions,  '+
						'IFNULL((SUM(ga.sessions)/SUM(ga.goal1Completions)),0.00) as precadastro_visitas,  '+
						'IFNULL((SUM(ga.goal1Completions)/SUM(ga.goal3Completions)),0.00) as dadospessoais_precadastro,  '+
						'IFNULL((SUM(ga.goal3Completions)/SUM(ga.goal2Completions)),0.00) as dependentes_dadospessoais,  '+
						'IFNULL((SUM(ga.goal2Completions)/SUM(ga.goal4Completions)),0.00) as corretor_dependentes,  '+
						'IFNULL((SUM(ga.goal4Completions)/SUM(ga.goal6Completions)),0.00) as checkout_corretor,  '+
						'IFNULL((SUM(ga.goal6Completions)/SUM(pd.vendas)),0.00) as compra_checkout,  '+
						'IFNULL(pd.vendas,0.00) as vendas,  '+
						'pd.valor_total as receita,  '+
						'ga.goal2Completions as qtd_dependentes,  '+
						'date_format(ga.date, "%d/%m/%y") as date,  '+
						'date_format(ga.date, "%d") as d,  '+
						'date_format(ga.date, "%m") as m,  '+
						'date_format(ga.date, "%Y") as y  '+
					'FROM  '+
						'ga_data ga '+
						'LEFT JOIN (select COUNT(id) as vendas, SUM(qtd_dependentes) as vidas, date_format(date_finish, "%Y-%m-%d") as date_finish, SUM(valor_total) as valor_total from plan_dash '+where_vida+' GROUP BY date_format(date_finish, "%Y-%m-%d")) AS pd ON ga.date=date_format(pd.date_finish, "%Y-%m-%d") '+
					where_ga+
					' GROUP BY ga.date, pd.date_finish; '
			
			connection.query(queryGA, function(errData, rowsData, fieldsData) {
				if (errData) throw errData;
				
				console.log('-----GGGAAA'+queryGA+'-----');
				//var rowsData = rowsDatas[0];
				
					res.send(JSON.stringify(rowsData))
				});
			});		
			

	});
	
	
	app.get('/getTable', isLoggedIn, function(req, res) {

		var connection = mysql.createConnection(dbConfig.connection);
		connection.query('USE ' + dbConfig.database);

		var connection_users = mysql.createConnection(dbOdontoConfig.connection);
		connection_users.query('USE ' + dbOdontoConfig.database);
		
		//var whereFoundFilter = 'where 1=1 ';
		var whereFoundFilter = '';
		
		//console.log(req.param("filterDiretor"));
		
		if(req.param("filterDiretor"))
			whereFoundFilter += 'and SCE.diretorCodigo in ('+req.param("filterDiretor")+') '

		if(req.param("filterGerente"))
			whereFoundFilter += 'and SCE.gerenteCodigo in ('+req.param("filterGerente")+') '

		if(req.param("filterRepresentante"))
			whereFoundFilter += 'and SCE.representanteCodigo in ('+req.param("filterRepresentante")+') '

		if(req.param("filterCorretora"))
			whereFoundFilter += 'and SCE.id_corretora in('+req.param("filterCorretora")+') '

		if(req.param("filterProdutor"))
			whereFoundFilter += 'and SCPE.id in ('+req.param("filterProdutor")+') '

		if(req.user.type == 1)
			whereFoundFilter += ' and c.CodNac = b.cod and b.status = 1 and b.id="'+req.user.id+'" '

		//console.log(whereFoundFilter);
		var queryFoundFilter = 
			'SELECT '+
				'CONCAT(SCE.ev," ",SCE.ea," ",SCE.aa) estruturaVenda '+
			'FROM  '+
				'servus_corretor_estruturadevenda SCE '+
				'LEFT JOIN servus_corretor_client c ON c.id = SCE.id_corretora '+
				'LEFT JOIN servus_corretor_produtor_estruturadevenda SCPE ON SCE.ev=SCPE.ev AND SCE.ea=SCPE.ea AND SCE.aa=SCPE.aa  '+
				'LEFT JOIN servus_corretor_dashboard b ON b.cod = c.CodNac  '+
			'WHERE '+
				'c.id = SCE.id_corretora '+
			whereFoundFilter +
			' group by SCE.ev,SCE.ea,SCE.aa; '
			
		;
		
		console.log('YYYYYYYYYYYYYY'+queryFoundFilter+'yyyyyyyyyy');
		
		connection_users.query(queryFoundFilter, function(errFoundFilter, rowsFoundFilter, fieldsFoundFilter) {
			if (errFoundFilter) throw errFoundFilter;

			var dates = req.param("datas");
			var now = new Date();
			var where_ga = "WHERE 1=1 ";
			var where_vida = "WHERE 1=1 ";
			var where_user = "WHERE 1=1 ";
			
			if(req.user.type == 1){
				if (rowsFoundFilter.length > 0){
					where_user += ' AND(';
					for (var i in rowsFoundFilter) {
						where_user += ' CONCAT(SCE.ev," ",SCE.ea," ",SCE.aa) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
					}
					where_user = where_user.substr(0, where_user.length-3)+')';
				}
			}
			//console.log(req.param("filterDiretor"));
			if(req.user.type == 1 || 
				((
					req.param("filterDiretor") !='' || 
					req.param("filterGerente") !='' || 
					req.param("filterRepresentante") !='' || 
					req.param("filterCorretora") !='' || 
					req.param("filterProdutor") !='' 
				))
			){
				if (rowsFoundFilter.length > 0){
					where_ga += ' AND(';
					where_vida += ' AND(';
					for (var i in rowsFoundFilter) {
						where_ga += ' CONCAT(ev," ",ea," ",aa) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
	//					where_vida += ' CONCAT(ev," ",ea," ",aa) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
	//					where_vida += ' CONCAT(ev_produtor," ",ea_produtor," ",aa_produtor) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
						where_vida += ' CONCAT(ev_selecionado," ",ea_selecionado," ",aa_selecionado) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
					}
					where_ga = where_ga.substr(0, where_ga.length-3)+')';
					where_vida = where_vida.substr(0, where_vida.length-3)+')';	
				}			
			}
			//console.log(req.param("filterProdutor"));
			
			if(dates){
				var dates_array = dates.split(" - ");
				var part = dates_array[0].split('/');
				var fromDate = part[2]+'-'+part[1]+'-'+part[0];
				part = dates_array[1].split('/');
				var toDate = part[2]+'-'+part[1]+'-'+part[0];
			}
			
			if(fromDate != undefined && toDate != undefined){
				where_ga += " AND ga.date >= '"+fromDate+"' AND ga.date <= '"+toDate+"' ";
				where_vida += " AND date_finish >= '"+fromDate+" 00:00:00' AND date_finish <= '"+toDate+" 23:59:59' ";
			}else{
				where_ga += " AND ga.date >= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-01' AND ga.date <= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"' ";
				where_vida += " AND date_finish >= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-01' AND date_finish <= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"' ";
				dates =  "01/"+(now.getMonth()+1)+"/"+now.getFullYear()+" - "+(now.getDate()-1)+"/"+(now.getMonth()+1)+"/"+now.getFullYear();
			}

			if(req.param("filterMidia")) {
				var midias = req.param("filterMidia").split(",");
				for (var i = 0; i < midias.length; i++) {
					midias[i] = "'" + midias[i] + "'";
				}
				where_ga += ' AND ga.corretor_type in ('+midias.join(",")+') ';
			}

			if(req.param("filterRegiao")) {
				var regioes = req.param("filterRegiao").split(",");
				for (var i = 0; i < regioes.length; i++) {
					regioes[i] = "'" + regioes[i] + "'";
				}
				where_ga += ' AND ga.regiao in ('+regioes.join(",")+') ';
			}
			
			var limit_date = (now.getDate()-1)+"/"+(now.getMonth()+1)+"/"+now.getFullYear()
			//where = " where date >= '2017-07-01' AND date <= '2018-07-10' ";
			
			var data = {};
			var dataFullVida = {};
			dataFullVida['vidas'] = {};
			dataFullVida['receitas'] = {};
			dataFullVida['vendas'] = {};
			var dataTotal = [];


			var groupby = '';
			var groupbypd = '';
			if(req.param("cdata") != 'false') {
				groupby += 'ga.date,';
				groupbypd += ' and ga.date=date_format(pd.date_finish, "%Y-%m-%d") ';
			}
			if(req.param("cev") != 'false') {
				groupby += 'ga.ev,';
				groupbypd += ' and ga.ev=pd.ev_s ';
			}			
			if(req.param("cea") != 'false') {
				groupby += 'ga.ea,';
				groupbypd += ' and ga.ea=pd.ea_s ';
			}
			if(req.param("caa") != 'false') {
				groupby += 'ga.aa,';
				groupbypd += ' and ga.aa=pd.aa_s ';
			}			
			if(req.param("cmidia") != 'false') {
				groupby += 'ga.corretor_type,';
			}
			if(req.param("cprodutor") != 'false') {
				groupby += 'ga.nmpd,';
			}
			

			if(groupby != '') groupby = 'GROUP BY  '+groupby.substr(0, groupby.length-1);
			
			var queryFullGA = 
					'SELECT  '+
						'ga.corretor,  '+
						'ga.corretor_type,  '+
						'coalesce(ga.regiao, \'\') as regiao,	'+
						'ga.ev,  '+
						'ga.ea,  '+
						'ga.aa,  '+
						'ga.idpd,  '+
						'UPPER(ga.nmpd) nmpd,  '+
						'SUM(ga.sessions) as sessions,  '+
						'SUM(ga.impressions) as impressions,  '+
						'SUM(ga.adClicks) as adClicks,  '+
						'SUM(ga.adCost) as adCost,  '+
						'SUM(ga.goal1Completions) as precadastro, '+
						'SUM(ga.goal2Completions) as dependentes, '+
						'SUM(ga.goal3Completions) as dadospessoais, '+
						'SUM(ga.goal4Completions) as corretor, '+
						'IFNULL(pd.vendas,0.00) as comprasfinalizada, '+
						'IFNULL(pd.vidas,0.00) as vidas, '+
						'SUM(ga.goal6Completions) as checkout, '+
						'pd.valor_total as transactionRevenue, '+
						'SUM(ga.transactions) as transactions,  '+
						'SUM(IFNULL((ga.sessions/ga.goal1Completions),0.00)) as precadastro_visitas,  '+
						'SUM(IFNULL((ga.goal1Completions/ga.goal3Completions),0.00)) as dadospessoais_precadastro,  '+
						'SUM(IFNULL((ga.goal3Completions/ga.goal2Completions),0.00)) as dependentes_dadospessoais,  '+
						'SUM(IFNULL((ga.goal2Completions/ga.goal4Completions),0.00)) as corretor_dependentes,  '+
						'SUM(IFNULL((ga.goal4Completions/ga.goal6Completions),0.00)) as checkout_corretor,  '+
						'SUM(IFNULL((ga.goal6Completions/pd.vendas),0.00)) as compra_checkout,  '+
						'IFNULL(pd.vendas,0.00) as vendas,  '+
						'IFNULL(pd.valor_total,0.00) as receitas,  '+
						'SUM(ga.goal2Completions) as qtd_dependentes,  '+
						'date_format(ga.date, "%d/%m/%y") as date '+
					'FROM  '+
						'ga_data ga '+
						'LEFT JOIN (select '+
									'ifnull(ev_selecionado,0) ev_s, '+
									'ifnull(ea_selecionado,0) ea_s, '+
									'ifnull(aa_selecionado,0) aa_s, '+
									'count(id) as vendas, '+
									'sum(qtd_dependentes) as vidas, '+
									'date_format(date_finish, "%Y-%m-%d") as date_finish, '+
									'sum(valor_total) as valor_total '+ 
								'from plan_dash '+where_vida+' group by date_format(date_finish, "%Y-%m-%d"), ev_selecionado, ea_selecionado, aa_selecionado ) AS pd ON 1=1 '+
								groupbypd+
						where_ga+ 
						groupby+
					' union  '+
						'SELECT  "corretor" as corretor, (case pd.ev_s when 999999 then "Corretor" else "" end) as corretor_type, coalesce(ga.regiao, \'\') as regiao, pd.ev_s as ev, pd.ea_s as ea, pd.aa_s as aa, "" as idpd, "" as nmpd, 0 as sessions,   '+
						'0 as impressions,  0 as adClicks, 0 as adCost, 0 as precadastro,  '+
						'IFNULL(pd.vidas,0.00) as dependentes, 0 as dadospessoais, 0 as corretor,  '+
						'0.00 as comprasfinalizada, IFNULL(pd.vidas,0.00) as vidas, 0 as checkout,  '+
						'pd.valor_total as transactionRevenue, 0 as transactions,   '+
						'0.00 as precadastro_visitas,   '+
						'0.00 as dadospessoais_precadastro,   '+
						'0.00 as dependentes_dadospessoais,   '+
						'0.00 as corretor_dependentes,   '+
						'0.00 as checkout_corretor,   '+
						'0.00 as compra_checkout,  IFNULL(pd.vendas,0.00) as vendas,   '+
						'IFNULL(pd.valor_total,0.00) as receitas, IFNULL(pd.vidas,0.00) as qtd_dependentes,   '+
						'date_format(pd.date_finish, "%d/%m/%y") as date  '+
						'FROM  ga_data ga  '+
						'RIGHT JOIN  '+
						'	(select ifnull(ev_selecionado,0) ev_s, ifnull(ea_selecionado,0) ea_s, ifnull(aa_selecionado,0) aa_s,  '+
						'	count(id) as vendas, sum(qtd_dependentes) as vidas, date_format(date_finish, "%Y-%m-%d") as date_finish,  '+
						'	sum(valor_total) as valor_total  '+
						'	from plan_dash '+where_vida+' group by date_format(date_finish, "%Y-%m-%d"), ev_selecionado, ea_selecionado, aa_selecionado ) AS pd ON 1=1 '+
						groupbypd+
						'WHERE 1=1  AND (ga.ev is null) ';
						
						if(req.param("filterMidia")) {
							var midias = req.param("filterMidia").split(",");
							for (var i = 0; i < midias.length; i++) {
								midias[i] = "'" + midias[i] + "'";
							}
							queryFullGA += ' AND ga.corretor_type in ('+midias.join(",")+') ';
						}

						if(req.param("filterRegiao")) {
							var regioes = req.param("filterRegiao").split(",");
							for (var i = 0; i < regioes.length; i++) {
								regioes[i] = "'" + regioes[i] + "'";
							}
							queryFullGA += ' AND ga.regiao in ('+regioes.join(",")+') ';
						}
						
			console.error('XXXXXXFullGA:'+queryFullGA+'xxxxxxxxxxxxxx');
// count(id)   sum(qtd_dep ;

			connection.query(queryFullGA, function(errData, rowsDatas, fieldsData) {
				if (errData) throw errData;
					res.send(JSON.stringify(rowsDatas))

				});
			});		

	});
	
	
	function indexPage(req, res){
		var connection = mysql.createConnection(dbConfig.connection);
		connection.query('USE ' + dbConfig.database);

		var connection_users = mysql.createConnection(dbOdontoConfig.connection);
		connection_users.query('USE ' + dbOdontoConfig.database);
		
		//var whereFoundFilter = 'where 1=1 ';
		var whereFoundFilter = '';
		
		if(req.param("filterDiretor"))
			whereFoundFilter += 'and SCE.diretorCodigo="'+req.param("filterDiretor")+'" '

		if(req.param("filterGerente"))
			whereFoundFilter += 'and SCE.gerenteCodigo="'+req.param("filterGerente")+'" '

		if(req.param("filterRepresentante"))
			whereFoundFilter += 'and SCE.representanteCodigo="'+req.param("filterRepresentante")+'" '

		if(req.param("filterCorretora"))
			whereFoundFilter += 'and SCE.id_corretora="'+req.param("filterCorretora")+'" '

		if(req.param("filterProdutor"))
			whereFoundFilter += 'and SCPE.id="'+req.param("filterProdutor")+'" '

		if(req.user.type == 1)
			whereFoundFilter += ' and c.CodNac = b.cod and b.status = 1 and b.id="'+req.user.id+'" '

		//console.log(whereFoundFilter);
		var queryFoundFilter = 
			'SELECT '+
				'CONCAT(SCE.ev," ",SCE.ea," ",SCE.aa) estruturaVenda '+
			'FROM  '+
				'servus_corretor_estruturadevenda SCE '+
				'LEFT JOIN servus_corretor_client c ON c.id = SCE.id_corretora '+
				'LEFT JOIN servus_corretor_produtor_estruturadevenda SCPE ON SCE.ev=SCPE.ev AND SCE.ea=SCPE.ea AND SCE.aa=SCPE.aa  '+
				'LEFT JOIN servus_corretor_dashboard b ON b.cod = c.CodNac  '+
			'WHERE '+
				'c.id = SCE.id_corretora '+
			whereFoundFilter +
			' group by SCE.ev,SCE.ea,SCE.aa; '
			
		;
		
		var queryDate = "select date_format(max(date),'%Y') as y, date_format(max(date),'%d') as d, date_format(max(date),'%m') as m from ga_data";

		connection.query(queryDate, function(errData, rowsDatasGA, fieldsDataGA) {
			if (errData) throw errData;
		
		connection_users.query(queryFoundFilter, function(errFoundFilter, rowsFoundFilter, fieldsFoundFilter) {
			if (errFoundFilter) throw errFoundFilter;

			var dates = req.param("datas");
			var now = new Date();
			var where_ga = "WHERE 1=1 ";
			var where_vida = "WHERE 1=1 ";
			var where_user = "WHERE 1=1 ";
			
			if(req.user.type == 1){
				if (rowsFoundFilter.length > 0){
					where_user += ' AND(';
					for (var i in rowsFoundFilter) {
						where_user += ' CONCAT(SCE.ev," ",SCE.ea," ",SCE.aa) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
					}
					where_user = where_user.substr(0, where_user.length-3)+')';
				}
			}
			//console.log(req.param("filterDiretor"));
			if(req.user.type == 1 || 
				((
					req.param("filterDiretor") !='' || 
					req.param("filterGerente") !='' || 
					req.param("filterRepresentante") !='' || 
					req.param("filterCorretora") !='' || 
					req.param("filterProdutor") !='' 
				) && req.param("confirmar") != undefined)
			){
				if (rowsFoundFilter.length > 0){
					where_ga += ' AND(';
					where_vida += ' AND(';
					for (var i in rowsFoundFilter) {
						where_ga += ' CONCAT(ev," ",ea," ",aa) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
						where_vida += ' CONCAT(ev_selecionado," ",ea_selecionado," ",aa_selecionado) = "'+rowsFoundFilter[i].estruturaVenda+'" OR';
					}
					where_ga = where_ga.substr(0, where_ga.length-3)+')';
					where_vida = where_vida.substr(0, where_vida.length-3)+')';	
				}			
			}
			//console.log(req.param("filterProdutor"));
			
			if(dates){
				var dates_array = dates.split(" - ");
				var part = dates_array[0].split('/');
				var fromDate = part[2]+'-'+part[1]+'-'+part[0];
				part = dates_array[1].split('/');
				var toDate = part[2]+'-'+part[1]+'-'+part[0];
			}
			
			if(fromDate != undefined && toDate != undefined){
				where_ga += " AND ga.date >= '"+fromDate+"' AND ga.date <= '"+toDate+"' ";
				where_vida += " AND date_finish >= '"+fromDate+" 00:00:00' AND date_finish <= '"+toDate+" 23:59:59' ";
			}else{
				where_ga += " AND ga.date >= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-01' AND ga.date <= '"+rowsDatasGA[0].y+"-"+rowsDatasGA[0].m+"-"+rowsDatasGA[0].d+"' ";
				where_vida += " AND date_finish >= '"+now.getFullYear()+"-"+(now.getMonth()+1)+"-01 00:00:00' AND date_finish <= '"+rowsDatasGA[0].y+"-"+rowsDatasGA[0].m+"-"+rowsDatasGA[0].d+" 23:59:59' ";
				dates =  "01/"+rowsDatasGA[0].m+"/"+rowsDatasGA[0].y+" - "+rowsDatasGA[0].d+"/"+rowsDatasGA[0].m+"/"+rowsDatasGA[0].y;
			}
			
			var limit_date = rowsDatasGA[0].d+"/"+rowsDatasGA[0].m+"/"+rowsDatasGA[0].y
			//where = " where date >= '2017-07-01' AND date <= '2018-07-10' ";
			
			var data = {};
			var dataFullVida = {};
			dataFullVida['vidas'] = {};
			dataFullVida['receitas'] = {};
			dataFullVida['vendas'] = {};
			var dataTotal = [];

			var queryGA = 
					'SELECT  '+
						'SUM(ga.sessions) as sessions,  '+
						'SUM(ga.impressions) as impressions,  '+
						'SUM(ga.adClicks) as adClicks,  '+
						'SUM(ga.adCost) as adCost,  '+
						'SUM(ga.goal1Completions) as precadastro, '+
						'SUM(ga.goal2Completions) as dependentes, '+
						'SUM(ga.goal3Completions) as dadospessoais, '+
						'SUM(ga.goal4Completions) as corretor, '+
						'SUM(ga.goal6Completions) as checkout '+
					'FROM  '+
						'ga_data ga '+
					where_ga


			var queryPD = 
					';SELECT  '+
						'COUNT(id) as vendas, '+
						'SUM(qtd_dependentes) as vidas, '+
						'SUM(valor_total) as receita '+
					'FROM  '+
						'plan_dash '+
						where_vida;
						
			var queryToDate = 
			 ';SELECT  '+
				'date_format(MAX(date), "%d/%m/%Y") as to_date '+
			  'FROM  '+
				'ga_data ';

					
			console.log(queryGA);
			console.log(queryPD);
			
			connection.query(queryGA+queryPD+queryToDate, function(errData, rowsDatas, fieldsData) {
				if (errData) throw errData;
				
				var limit_date = rowsDatas[2][0].to_date;
				var rowsDataPD = rowsDatas[1][0];
				var rowsDataGA = rowsDatas[0][0];
				
						dataTotal['sessions'] = rowsDataGA.sessions;
						dataTotal['impressions'] = rowsDataGA.impressions;
						dataTotal['adClicks'] = rowsDataGA.adClicks;
						dataTotal['adCost'] = rowsDataGA.adCost;
						dataTotal['precadastro'] = rowsDataGA.precadastro;
						dataTotal['dependentes'] = rowsDataGA.dependentes;
						dataTotal['dadospessoais'] = rowsDataGA.dadospessoais;
						dataTotal['corretor'] = rowsDataGA.corretor;
						dataTotal['comprasfinalizada'] = rowsDataGA.comprasfinalizada;
						dataTotal['checkout'] = rowsDataGA.checkout;

						dataTotal['vidas'] = rowsDataPD.vidas;
						dataTotal['vendas'] = rowsDataPD.vendas;
						dataTotal['receita'] = rowsDataPD.receita;

					
					connection.end();
					connection_users.end();			
					res.render('index.ejs',{
						user : req.user,
						filterDiretor : req.param("filterDiretor"),
						filterGerente : req.param("filterGerente"),
						filterRepresentante : req.param("filterRepresentante"),
						filterCorretora : req.param("filterCorretora"),
						filterMidia : req.param("filterMidia"),
						filterProdutor : req.param("filterProdutor"),
						filterEstrutura : req.param("filterEstrutura"),
						filterRegiao : req.param("filterRegiao"),
						datasFilter: dates,
						limit_date : limit_date,
						dataTotal : dataTotal
					});
				});
			});		
		});
	};

	app.get('/login', function(req, res) {

		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}

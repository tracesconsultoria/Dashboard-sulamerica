$(document).ready(function() {

	// $('#filterDiretor').multiselect({
	// 	onDropdownHide : function() {}
 //    });

	

	$('#buttonFilter').on('click', function (e) {		
		setDiretor(null, null, null, null, null, null, null, false);
		setGerente(null, null, null, null, null, null, null, false);
		setRepresentante(null, null, null, null, null, null, null, false);
		setCorretora(null, null, null, null, null, null, null, false);
		setMidia();
		setRegioes();
		setEstrutura(null, null, null, null, null, null, null, false);
		setProdutor(null, null, null, null, null, null, null, false);
	});
	
	$('#filterDiretor').on('change', function (e) {
		$('#filterGerente').find('option').remove();
		$('#filterRepresentante').find('option').remove();
		$('#filterCorretora').find('option').remove();
		$('#filterEstrutura').find('option').remove();
		$('#filterProdutor').find('option').remove();

		$('#filterDiretor').val().forEach(function(valor) {
			setGerente(valor);
			setRepresentante(valor);
			setCorretora(valor);
			setEstrutura(valor);
			setProdutor(valor);
		});

		$('.selectpicker').selectpicker('refresh');
	});
	
	$('#filterGerente').on('change', function (e) {
		$('#filterDiretor').find('option').remove();
		$('#filterRepresentante').find('option').remove();
		$('#filterCorretora').find('option').remove();
		$('#filterEstrutura').find('option').remove();
		$('#filterProdutor').find('option').remove();

		$('#filterGerente').val().forEach(function(valor) {
			setDiretor(null, valor);
			setRepresentante(null, valor);
			setCorretora(null, valor);
			setEstrutura(null, valor);
			setProdutor(null, valor);
		});

		$('.selectpicker').selectpicker('refresh');
	});
	
	$('#filterRepresentante').on('change', function (e) {
		$('#filterDiretor').find('option').remove();
		$('#filterGerente').find('option').remove();
		$('#filterCorretora').find('option').remove();
		$('#filterEstrutura').find('option').remove();
		$('#filterProdutor').find('option').remove();

		$('#filterRepresentante').val().forEach(function(valor) {
			setDiretor(null, null, $('#filterRepresentante').val());
			setGerente(null, null, $('#filterRepresentante').val());
			setCorretora(null, null, $('#filterRepresentante').val());
			setEstrutura(null, null, $('#filterRepresentante').val());
			setProdutor(null, null, $('#filterRepresentante').val());
		});
		
		$('.selectpicker').selectpicker('refresh');
	});
	
	$('#filterCorretora').on('change', function (e) {
		$('#filterDiretor').find('option').remove();
		$('#filterGerente').find('option').remove();
		$('#filterRepresentante').find('option').remove();
		$('#filterEstrutura').find('option').remove();
		$('#filterProdutor').find('option').remove();

		$('#filterCorretora').val().forEach(function(valor) {
			setDiretor(null, null, null, valor);
			setGerente(null, null, null, valor);
			setRepresentante(null, null, null, valor);
			setEstrutura(null, null, null, valor);
			setProdutor(null, null, null, valor);
		});
		
		$('.selectpicker').selectpicker('refresh');
	});

	$('#filterEstrutura').on('change', function (e) {
		$('#filterDiretor').find('option').remove();
		$('#filterGerente').find('option').remove();
		$('#filterRepresentante').find('option').remove();
		$('#filterCorretora').find('option').remove();
		$('#filterProdutor').find('option').remove();

		$('#filterEstrutura').val().forEach(function(valor) {
			setDiretor(null, null, null, null, null, valor);
			setGerente(null, null, null, null, null, valor);
			setRepresentante(null, null, null, null, null, valor);
			setCorretora(null, null, null, null, null, valor);
			setProdutor(null, null, null, null, null, valor);
		});

		$('.selectpicker').selectpicker('refresh');
	});
	
	$('#filterProdutor').on('change', function (e) {
		
		$('#filterDiretor').find('option').remove();
		$('#filterGerente').find('option').remove();
		$('#filterRepresentante').find('option').remove();
		$('#filterCorretora').find('option').remove();
		$('#filterEstrutura').find('option').remove();

		$('#filterProdutor').val().forEach(function(valor) {
			setDiretor(null, null, null, null, null, null, valor);
			setGerente(null, null, null, null, null, null, valor);
			setRepresentante(null, null, null, null, null, null, valor);
			setCorretora(null, null, null, null, null, null, valor);
			setEstrutura(null, null, null, null, null, null, valor);
		});

		$('.selectpicker').selectpicker('refresh');
		
	});

});

function setDiretor(idDiretor = null, idGerente = null, idRepresentante = null, idCorretor = null, idMidia = null, idEstruturaVenda = null, idProdutor = null, isOnChange = true){
	var data = {};
	for(i=0; i < document.arrFilter.length; i++){
		if(
			document.arrFilter[i].diretorCodigo != null && 
			document.arrFilter[i].diretorNome != null &&
			document.arrFilter[i].diretorCodigo != '-1'
		){
			if(validation(document.arrFilter[i], idDiretor, idGerente, idRepresentante, idCorretor, idMidia, idEstruturaVenda , idProdutor)){	
				data[document.arrFilter[i].diretorCodigo] = document.arrFilter[i].diretorNome;
			}
		}
	}

	var valoresMacados = createOptions(document.getElementById("filterDiretor"), data);

	if (isOnChange) {
		var tempVal = $("#filterDiretor").selectpicker('val');
		tempVal.push(valoresMacados);
		$("#filterDiretor").selectpicker('val', tempVal);
	}
	
	if(Object.keys(data).length == 1){
		$("#filterDiretor").attr('readonly', 'readonly');
	}else{
		$("#filterDiretor").removeAttr('readonly');
	}
} 

function setGerente(idDiretor = null, idGerente = null, idRepresentante = null, idCorretor = null, idMidia = null, idEstruturaVenda = null, idProdutor = null, isOnChange = true){
	var data = {};
	for(i=0; i < document.arrFilter.length; i++){
		if(
			document.arrFilter[i].gerenteCodigo != null && 
			document.arrFilter[i].gerenteNome != null &&
			document.arrFilter[i].gerenteCodigo != '-1'
		){
			if(validation(document.arrFilter[i], idDiretor, idGerente, idRepresentante, idCorretor, idMidia, idEstruturaVenda , idProdutor)){	
				data[document.arrFilter[i].gerenteCodigo] = document.arrFilter[i].gerenteNome;
			}
		}
	}

	var valoresMacados = createOptions(document.getElementById("filterGerente"), data);

	if (isOnChange) {
		var tempVal = $("#filterGerente").selectpicker('val');
		tempVal.push(valoresMacados);
		$("#filterGerente").selectpicker('val', tempVal);
	}
	
	if(Object.keys(data).length == 1){
		$("#filterGerente").attr('readonly', 'readonly');
	}else{
		$("#filterGerente").removeAttr('readonly');
	}
} 

function setRepresentante(idDiretor = null, idGerente = null, idRepresentante = null, idCorretor = null, idMidia = null, idEstruturaVenda = null, idProdutor = null, isOnChange = true){
	var data = {};
	for(i=0; i < document.arrFilter.length; i++){
		if(
			document.arrFilter[i].representanteCodigo != null && 
			document.arrFilter[i].representanteNome != null &&
			document.arrFilter[i].representanteCodigo != '-1'
		){
			if(validation(document.arrFilter[i], idDiretor, idGerente, idRepresentante, idCorretor, idMidia, idEstruturaVenda , idProdutor)){	
				data[document.arrFilter[i].representanteCodigo] = document.arrFilter[i].representanteNome;
			}
		}
	}

	var valoresMacados = createOptions(document.getElementById("filterRepresentante"), data);

	if (isOnChange) {
		var tempVal = $("#filterRepresentante").selectpicker('val');
		tempVal.push(valoresMacados);
		$("#filterRepresentante").selectpicker('val', tempVal);
	}
	
	if(Object.keys(data).length == 1){
		$("#filterRepresentante").attr('readonly', 'readonly');
	}else{
		$("#filterRepresentante").removeAttr('readonly');
	}
} 

function setCorretora(idDiretor = null, idGerente = null, idRepresentante = null, idCorretor = null, idMidia = null, idEstruturaVenda = null, idProdutor = null, isOnChange = true){
	var data = {};
	for(i=0; i < document.arrFilter.length; i++){
		if(
			document.arrFilter[i].id_corretora != null && 
			document.arrFilter[i].corretor_nome != null &&
			document.arrFilter[i].id_corretora != '-1'
		){
			if(validation(document.arrFilter[i], idDiretor, idGerente, idRepresentante, idCorretor, idMidia, idEstruturaVenda , idProdutor)){	
				data[document.arrFilter[i].id_corretora] = document.arrFilter[i].corretor_nome;
			}
		}
	}

	var valoresMacados = createOptions(document.getElementById("filterCorretora"), data);

	if (isOnChange) {
		var tempVal = $("#filterCorretora").selectpicker('val');
		tempVal.push(valoresMacados);
		$("#filterCorretora").selectpicker('val', tempVal);
	}
	
	if(Object.keys(data).length == 1){
		$("#filterCorretora").attr('readonly', 'readonly');
	}else{
		$("#filterCorretora").removeAttr('readonly');
	}
} 

function setMidia(dados=null, idDiretor = null, idGerente = null, idRepresentante = null, idCorretor = null, idMidia = null, idEstruturaVenda = null, idProdutor = null){
	var data = {};
	
	$.each(document.midias, function( index, value ) {
		data[value.corretor_type] = value.corretor_type;
	});

	console.log(data);

	$("#filterMidia").html(createHtmlSelect(data, $("#filterMidia").val() ? $("#filterMidia").val() : document.filterMidia));
	
}

function setRegioes(dados=null, idDiretor = null, idGerente = null, idRepresentante = null, idCorretor = null, idMidia = null, idEstruturaVenda = null, idProdutor = null){
	var data = {};
	
	$.each(document.regioes, function( index, value ) {
		data[value.regiao] = value.regiao;
	});

	$("#filterRegiao").html(createHtmlSelect(data, $("#filterRegiao").val() ? $("#filterRegiao").val() : document.filterRegiao));
	
}

function setEstrutura(idDiretor = null, idGerente = null, idRepresentante = null, idCorretor = null, idMidia = null, idEstruturaVenda = null, idProdutor = null, isOnChange = true){
	var data = {};
	for(i=0; i < document.arrFilter.length; i++){
		if(
			document.arrFilter[i].estruturaVenda != null && 
			document.arrFilter[i].estruturaVenda != null &&
			document.arrFilter[i].estruturaVenda != '-1'
		){
			if(validation(document.arrFilter[i], idDiretor, idGerente, idRepresentante, idCorretor, idMidia, idEstruturaVenda , idProdutor)){	
				data[document.arrFilter[i].estruturaVenda] = document.arrFilter[i].estruturaVenda;
			}
		}
	}
	
	var valoresMacados = createOptions(document.getElementById("filterEstrutura"), data);

	if (isOnChange) {
		var tempVal = $("#filterEstrutura").selectpicker('val');
		tempVal.push(valoresMacados);
		$("#filterEstrutura").selectpicker('val', tempVal);
	}
	
	if(Object.keys(data).length == 1){
		$("#filterEstrutura").attr('readonly', 'readonly');
	}else{
		$("#filterEstrutura").removeAttr('readonly');
	}
} 

function setProdutor(idDiretor = null, idGerente = null, idRepresentante = null, idCorretor = null, idMidia = null, idEstruturaVenda = null, idProdutor = null, isOnChange = true){
	var data = {};
	for(i=0; i < document.arrFilter.length; i++){
		if(
			document.arrFilter[i].id_produtor != null && 
			document.arrFilter[i].produtor_nome != null &&
			document.arrFilter[i].id_produtor != '-1'
		){
			if(validation(document.arrFilter[i], idDiretor, idGerente, idRepresentante, idCorretor, idMidia, idEstruturaVenda , idProdutor)){	
				data[document.arrFilter[i].id_produtor] = document.arrFilter[i].produtor_nome;
			}
		}
	}

	var valoresMacados = createOptions(document.getElementById("filterProdutor"), data);

	if (isOnChange) {
		var tempVal = $("#filterProdutor").selectpicker('val');
		tempVal.push(valoresMacados);
		$("#filterProdutor").selectpicker('val', tempVal);
	}
	
	if(Object.keys(data).length == 1){
		$("#filterProdutor").attr('readonly', 'readonly');
	}else{
		$("#filterProdutor").removeAttr('readonly');
	}
	
} 

function createOptions(select, dataList) {

	if (!select) {
		return;
	}

	var val = [];
	$.each(sortProperties(dataList), function( index, value ) {
		let option = document.createElement('option');
		option.value = value[0];
		option.text = value[1];
		
		select.add(option);

		val.push(value[0]);
	});
	return val;	
}

function createHtmlSelect(dataList, selected){
	//var html = Object.keys(dataList).length > 1 ? "<option value=''>selecionar...</option>" : "";
	var html = "";	
	$.each(sortProperties(dataList), function( index, value ) {
		html += "<option value='"+value[0]+"' "+(value[0] == selected ? 'selected':'')+">"+value[1]+"</option>";
	});
	
	return html;
}

function validation(data, idDiretor = null, idGerente = null, idRepresentante = null, idCorretor = null, idMidia = null, idEstruturaVenda = null, idProdutor = null){
	if(idDiretor != null && idDiretor != '' && data.diretorCodigo != idDiretor){
		return false;
	}
	
	if(idGerente != null && idGerente != '' && data.gerenteCodigo != idGerente){
		return false;
	}
	
	if(idRepresentante != null && idRepresentante != '' && data.representanteCodigo != idRepresentante){
		return false;
	}
	
	if(idCorretor != null && idCorretor != '' && data.id_corretora != idCorretor){
		return false;
	}
	
	if(idEstruturaVenda != null && idEstruturaVenda != '' && data.estruturaVenda != idEstruturaVenda){
		return false;
	}
	
	if(idProdutor != null && idProdutor != '' && data.id_produtor != idProdutor){
		return false;
	}
	
	return true;
}

var roundToPlusInfinity = function(n, fd) {
    var scale = Math.pow(10, fd),
        rounded = fd ? Math.floor((n * scale + 0.5)) / scale :
        Math.round(n);
    return rounded.toString();
};

function sortProperties(obj)
{
  // convert object into array
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]
	
	// sort items by value
	sortable.sort(function(a, b)
	{
		var x=a[1].toLowerCase(),
			y=b[1].toLowerCase();
		return x<y ? -1 : x>y ? 1 : 0;
	});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function limparFiltros() {
	document.filterDiretor='';
	document.filterGerente='';
	document.filterRepresentante='';
	document.filterCorretora='';
	document.filterEstrutura='';
	document.filterMidia='';
	document.filterProdutor='';
	
	$('#filterDiretor').find('option').remove();
	$('#filterGerente').find('option').remove();
	$('#filterRepresentante').find('option').remove();
	$('#filterCorretora').find('option').remove();
	$('#filterEstrutura').find('option').remove();
	$('#filterProdutor').find('option').remove();
	$('#filterMidia').find('option').remove();
	$('#filterRegiao').find('option').remove();
}

function cleanFilter(){
	limparFiltros();
	
	setDiretor(null, null, null, null, null, null, null, false);
	setGerente(null, null, null, null, null, null, null, false);
	setRepresentante(null, null, null, null, null, null, null, false);
	setCorretora(null, null, null, null, null, null, null, false);
	setMidia();
	setEstrutura(null, null, null, null, null, null, null, false);
	setProdutor(null, null, null, null, null, null, null, false);

	$('.selectpicker').selectpicker('refresh');
}





function createTable(columns){
	$("#loadingTable").css("display","block");
	
		
	var subUrl = '';
	if(columns != undefined){
		var cdata = columns[0];
		var cmidia = columns[1];
		var cev = columns[2];
		var cea = columns[3];
		var caa = columns[4];
		var cprodutor = columns[5];
	}else{
		var cdata = true;
		var cmidia = true;
		var cev = true;
		var cea = true;
		var caa = true;
		var cprodutor = true;
	}
	
	subUrl += '&cdata='+cdata+'&cmidia='+cmidia+'&cev='+cev+'&cea='+cea+'&caa='+caa+'&cprodutor='+cprodutor;	

	
	
	var url = "/getTable?filterDiretor="+document.filterDiretor+"&filterGerente="+document.filterGerente+"&filterRepresentante="+document.filterRepresentante+"&filterCorretora="+document.filterCorretora+"&filterMidia="+document.filterMidia+"&filterProdutor="+document.filterProdutor+"&filterEstrutura="+document.filterEstrutura+"&datas="+document.datas+"&filterRegiao="+document.filterRegiao+subUrl;
	console.log(url);
	$.get(url, function(arrGA) {
		fullGA = JSON.parse(arrGA);
		table = "<table id='tabela_dados' class='table dt-responsive table-striped table-bordered' cellspacing='0' width='200%'>";
		table += "<thead>";
		table += "<tr>";
		
		table += "<th>Data</th>";
		table += "<th>Midia</th>";
		table += "<th>Região</th>";
		table += "<th>EV</th>";
		table += "<th>EA</th>";
		table += "<th>AA</th>";
		table += "<th>Produtor</th>";
		table += "<th>Impressões</th>";
		table += "<th>Custo</th>";
		table += "<th>Cliques</th>";
		table += "<th>Visitas</th>";
		table += "<th style='white-space:nowrap;'>Pré-Cadastro</th>";
		table += "<th style='white-space:nowrap'>Pré-Cadastro<br> por Visitas</th>";
		table += "<th style='white-space:nowrap'>Dados Pessoais</th>";
		table += "<th style='white-space:nowrap'>Dados Pessoais<br> por Pré-Cadastro</th>";
		table += "<th>Dependentes</th>";
		table += "<th style='white-space:nowrap'>Dependentes por<br> Dados Pessoais</th>";
		table += "<th>Corretor</th>";
		table += "<th style='white-space:nowrap'>Corretor por<br> Dependentes</th>";
		table += "<th>Checkout</th>";
		table += "<th>CPC</th>";
		table += "<th>CPV</th>";
		table += "<th>CPL</th>";
		table += "<th>CPA</th>";
		table += "<th>ROI</th>";
		table += "<th>CTR</th>";
		table += "<th>CR</th>";
		table += "<th>CPV</th>";
		table += "<th>VTR</th>";
		table += "<th style='white-space:nowrap'>Checkout por<br> Corretor</th>";
		table += "<th>Compra</th>";
		table += "<th style='white-space:nowrap'>Compra por<br> Checkout</th>";
		table += "<th style='white-space:nowrap'>Compra por<br> Visita</th>";
		table += "<th>Receita</th>";
		table += "<th>Vidas</th>";
		table += "</tr>";
		table += "</thead>";
		table += "<tbody id='tbody_info'>";

		for (var i in fullGA) {			
			table += "<tr>";
			table += "<td>"+fullGA[i].date+"</td>";
			table += "<td>"+fullGA[i].corretor_type+"</td>";
			table += "<td>"+fullGA[i].regiao+"</td>";
			table += "<td>"+fullGA[i].ev+"</td>";
			table += "<td>"+fullGA[i].ea+"</td>";
			table += "<td>"+fullGA[i].aa+"</td>";
			table += "<td>"+(fullGA[i].nmpd == '0' ? '&nbsp;' : fullGA[i].nmpd)+"</td>";
			table += "<td>"+fullGA[i].impressions+"</td>";
			table += "<td>"+fullGA[i].adCost+"</td>";
			table += "<td>"+fullGA[i].adClicks+"</td>";
			table += "<td>"+fullGA[i].sessions+"</td>";
			table += "<td>"+fullGA[i].precadastro+"</td>";
			table += "<td>"+fullGA[i].precadastro_visitas+"</td>";
			table += "<td>"+fullGA[i].dadospessoais+"</td>";
			table += "<td>"+fullGA[i].dadospessoais_precadastro+"</td>";
			table += "<td>"+fullGA[i].dependentes+"</td>";
			table += "<td>"+fullGA[i].dependentes_dadospessoais+"</td>";
			table += "<td>"+fullGA[i].corretor+"</td>";
			table += "<td>"+fullGA[i].corretor_dependentes+"</td>";
			table += "<td>"+fullGA[i].checkout+"</td>";
			table += "<td>"+(fullGA[i].adCost > fullGA[i].adClicks && fullGA[i].adClicks > 0 ? (fullGA[i].adCost/fullGA[i].adClicks).toFixed(2) : 0)+"</td>";
			table += "<td>"+(fullGA[i].adCost > fullGA[i].sessions && fullGA[i].sessions > 0 ? (fullGA[i].adCost/fullGA[i].sessions).toFixed(2) : 0)+"</td>";
			table += "<td>"+(fullGA[i].adCost > fullGA[i].dadospessoais && fullGA[i].dadospessoais > 0 ? (fullGA[i].adCost/fullGA[i].dadospessoais).toFixed(2) : 0)+"</td>";
			table += "<td>"+(fullGA[i].adCost > fullGA[i].vendas && fullGA[i].vendas > 0 ? (fullGA[i].adCost/fullGA[i].vendas).toFixed(2) : 0)+"</td>";
			table += "<td>"+(fullGA[i].receitas > fullGA[i].adCost && fullGA[i].adCost > 0 ? (fullGA[i].receitas/fullGA[i].adCost).toFixed(2) : 0)+"</td>";
			table += "<td>"+(fullGA[i].adClicks > fullGA[i].impressions && fullGA[i].impressions > 0 ? (fullGA[i].adClicks/fullGA[i].impressions).toFixed(2) : 0)+"</td>";
			table += "<td>"+(fullGA[i].sessions > fullGA[i].adClicks && fullGA[i].adClicks > 0 ? (fullGA[i].sessions/fullGA[i].adClicks).toFixed(2) : 0)+"</td>";
			table += "<td>"+(fullGA[i].adCost > fullGA[i].dependentes && fullGA[i].dependentes > 0 ? (fullGA[i].adCost/fullGA[i].dependentes).toFixed(2) : 0)+"</td>";
			table += "<td>"+(fullGA[i].dependentes > fullGA[i].impressions && fullGA[i].impressions > 0 ? (fullGA[i].dependentes/fullGA[i].impressions).toFixed(2) : 0)+"</td>";			
			table += "<td>"+fullGA[i].checkout_corretor+"</td>";
			table += "<td>"+fullGA[i].vendas+"</td>";
			table += "<td>"+(fullGA[i].vendas >= fullGA[i].checkout && fullGA[i].checkout > 0 && fullGA[i].vendas > 0 ? (fullGA[i].vendas / fullGA[i].checkout).toFixed(2) : '0')+"</td>";			
			table += "<td>"+(fullGA[i].vendas >= fullGA[i].sessions && fullGA[i].sessions > 0 && fullGA[i].vendas > 0 ? (fullGA[i].vendas / fullGA[i].sessions).toFixed(2) : '0')+"</td>";			
			table += "<td>"+(fullGA[i].receitas ? fullGA[i].receitas.toFixed(2) : '0.00')+"</td>";
			table += "<td>"+(fullGA[i].vidas ? fullGA[i].vidas.toFixed(2) : '0')+"</td>";
			table += "</tr>";
			
		}

		table += "</tbody></table>";
		
		$("#loadingTable").css("display","none");

		$('#divTable').html(table);
		
		$('#tabela_dados').DataTable({
			"scrollX": true,
			dom: 'Bfrtip', //show/hide columns
			"autoWidth": true,
			"ordering": true,
			buttons: [
				{
					extend: 'copyHtml5',
					exportOptions: {
						columns: [ 0, ':visible' ]
					}
				},
				{
					extend: 'excelHtml5',
					exportOptions: {
						columns: ':visible'
					}
				},
				{
					extend: 'print',
					exportOptions: {
						columns: ':visible',
					}
				},
				'colvis',
			],
			"language": {
				"search": "Procurar",
				"zeroRecords": "Nada foi Localizado",
				"info": "Exibindo _PAGE_ de _PAGES_",
				"infoEmpty": "Nenhum Registro informado",
				"paginate": {
					"first":      "Primeiro",
					"last":       "Ultimo",
					"next":       "Próximo",
					"previous":   "Voltar"
				},
				"buttons": {
					"copy":      "Copiar",
					"print":       "Imprimir",
					"colvis":       "Colunas",
				},
				"infoFiltered": "(filtered from _MAX_ total records)"
			}
			
		});

		var table = $('#tabela_dados').DataTable();
		table.column( 0 ).visible( cdata);
		table.column( 1 ).visible( cmidia );
		table.column( 2 ).visible( cev );
		table.column( 3 ).visible( cea );
		table.column( 4 ).visible( caa );
		table.column( 5 ).visible( cprodutor );
	
	
	$('#tabela_dados').on( 'column-visibility.dt', function ( e, settings, column, state ) {
		var table = $('#tabela_dados').DataTable();
		//table.columns( '.detail' ).visible( false );
		
		createTable(table.columns().visible());
		$(".dt-button-background").trigger("click");
		console.log(table.columns().visible());
	});

		
	})


}

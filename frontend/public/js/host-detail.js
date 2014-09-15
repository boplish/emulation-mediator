function updateTable() {
	$('#table').empty();
	var hostid = document.URL.split('/')[document.URL.split('/').length - 1];
	var host = emu.hosts[hostid];
	var ip = host.ip;
	var port = host.port;
	var peercount = host.peers.length
	$.tmpl('table-template', {ip: ip, port: port, peercount: peercount}).appendTo('#table');
}

function clickHandlerRefreshUI() {
	updateHostNavUI(function(){
		updateTable();	
	});
}

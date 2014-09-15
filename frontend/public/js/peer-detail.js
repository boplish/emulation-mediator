function updateTable() {
	$('#table').empty();
	var peerid = document.URL.split('/')[document.URL.split('/').length - 1];
	/*var host = emu.hosts[hostid];
	var ip = host.ip;
	var port = host.port;
	var peercount = host.peers.length'*/
	$.tmpl('table-template', {host: '127.0.0.1:9000' , peercount: 0}).appendTo('#table');
}

function clickHandlerRefreshUI() {
	updateHostNavUI(function(){
		updateTable();	
	});
}

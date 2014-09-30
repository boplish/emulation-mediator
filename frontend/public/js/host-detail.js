function updateHostDetailTable() {
	var hostid = document.URL.split('/')[document.URL.split('/').length - 1];
	var host = emu.hosts[hostid];
	host.getHostStatus(function(err, status) {
		var uptime = Math.abs(new Date() - new Date(status.startDate));
		$('#table').empty();
		$.tmpl('table-template', {bootstrap: status.bootstrapNode, uptime: uptime, ip: ip, port: port, peercount: status.numberOfPeers}).appendTo('#table');
	});
	var ip = host.ip;
	var port = host.port;
	var peercount = host.peers.length;
}

function clickHandlerRefreshUI() {
	updateHostNavUI(function(){
		updateHostDetailTable();
	});
}

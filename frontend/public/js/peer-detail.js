function updatePeerDetailTable() {
	$('#table').empty();
	var peerid = document.URL.split('/')[document.URL.split('/').length - 1];
	var host;

	for (var hostkey in emu.hosts) {
		if (emu.hosts[hostkey].peers.indexOf(peerid) !== -1) {
			host = emu.hosts[hostkey];
		}
	}
	$.tmpl('table-template', {host: host}).appendTo('#table');
}

function clickHandlerRefreshUI() {
	updateHostNavUI(function(){
		updatePeerDetailTable();	
	});
}

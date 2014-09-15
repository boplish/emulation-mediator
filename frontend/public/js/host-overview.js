function updateTable() {
	$('#table').empty();
	var hostcount = Object.keys(emu.hosts).length;
	var peercount = 0;
	for (var k in emu.hosts) {
		peercount += Object.keys(emu.hosts[k].peers).length;
	}
	$.tmpl('table-template', {hostcount: hostcount, peercount: peercount}).appendTo('#table');
}

function clickHandlerRefreshUI() {
	updateHostNavUI(function(){
		updateTable();	
	});
}
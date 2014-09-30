google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(drawChart);

function drawChart() {
	//console.log('draw chart');
}

/** App */
var emu = new Emulation('http://localhost:1336');

/** Templates */
$.template('host-nav-template', $('#host-nav-template'));
$.template('host-nav-peer-template', $('#host-nav-peer-template'));
$.template('table-template', $('#table-template'));

/** Populate templates */
function updateHostNavUI(done) {
	emu.getHosts(function(err, hosts) {
		var data = [];
		for (var k in hosts) {
			data.push(hosts[k]);
		}
		$('#host-nav').empty();
		$.tmpl('host-nav-template', data).appendTo('#host-nav');
		if (done) {
			done();	
		}
	});
}


/** User interface setup */

// Button: Add host
$('#formAddHost').submit(function(ev){
	event.preventDefault();
	var ip = $( "input:eq(0)" ).val();
	var port = $( "input:eq(1)" ).val();
	emu.addHost({ip: ip, port: port}, function() {
		clickHandlerRefreshUI();
	});
});

// Button: Add Peer
function clickHanderStartPeer(id) {
	emu.startPeer(id, function() {
		updateHostNavUI();
	});
}

function clickHandlerAbortPeer(hostId, peerId) {
	//@todo
	emu.abortPeer(hostId, peerId, function() {
		updateHostNavUI();
	});
}

function clickHandlerRefreshUI() {
	updateHostNavUI();
}

/** startup */
setInterval(function(){
	clickHandlerRefreshUI();
}, 1000);

function update() {
	localStorage.setItem("size", $("input:radio[name=size]:checked").val());
	localStorage.setItem("short", $("#short").prop("checked"));
	chrome.tabs.getSelected(null, function(tab) {
		$("#qrCode").width(localStorage.getItem("size")).height(localStorage.getItem("size"));
		if (localStorage.getItem("short") == "true") {
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "https://www.googleapis.com/urlshortener/v1/url", false);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.onload = function() {
				$("#qrCode").css("background-image", "url(https://chart.googleapis.com/chart?cht=qr&chld=H|0&chs=" + localStorage.getItem("size") + "&chl=" + JSON.parse(xhr.responseText).id + ")");
			}
			xhr.send(JSON.stringify({longUrl: tab.url}));
		} else {
			$("#qrCode").css("background-image", "url(https://chart.googleapis.com/chart?cht=qr&chld=H|0&chs=" + localStorage.getItem("size") + "&chl=" + encodeURIComponent(tab.url) + ")");
		}
	});
}
$(document).ready(function() {
	localStorage.setItem("size", (!localStorage.getItem("size")) ? 300 : localStorage.getItem("size"));
	localStorage.setItem("short", (!localStorage.getItem("short")) ? false : localStorage.getItem("short"));
	switch (localStorage.getItem("size")) {
		case "200":
			$("#s").prop("checked", true);
			break;
		case "400":
			$("#l").prop("checked", true);
			break;
		case "500":
			$("#xl").prop("checked", true);
			break;
		case "300": default:
			$("#m").prop("checked", true);
			break;
	}
	$("#short").prop("checked", (localStorage.getItem("short") == "true") ? true : false);
	$("#size").buttonset();
	$("#short").button({
		text: false,
		icons: {primary: "ui-icon-scissors"}
	});
	$("input:radio[name=size], #short").change(function() {
		update();
	});
	update();
});
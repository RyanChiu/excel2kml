function startswith(title) {
	var startswith = '\
<?xml version="1.0" encoding="UTF-8"?>\n\
	<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">\n\
	<Document>\n\
	<name>' + title + '</name>\n\
	';
	return startswith;
}

/**
<color>
颜色和不透明度 (alpha) 值以十六进制表示法表示。
任何一种颜色的值范围都是 0 到 255（00 到 ff）。
对于 alpha，00 表示完全透明，ff 表示完全不透明。
表达式顺序是“aabbggrr”，其中“aa=alpha”（00 到 ff）；“bb=blue”（00 到 ff）；“gg=green”（00 到 ff)；“rr=red”（00 到 ff）。
例如，如果您希望对某叠加层应用不透明度为 50% 的蓝色，
则应指定以下值：<color>7fff0000</color>，其中“alpha”=0x7f，“blue”=0xff，“green”=0x00，“red”=0x00。
*/
function per2color(per) {
	if (per > 0.95) return "ff000000";//黑色
	if (per > 0.85 && per <= 0.95) return "ff0000ff";//鲜红
	if (per > 0.75 && per <= 0.85) return "ff0080ff";//橙色
	if (per > 0.5 && per <= 0.75) return "ffff8000";//浅蓝
	if (per <= 0.5) return "ff80ff80";//浅绿
}
function srvs2color(srvs) {
	if (srvs <= 5) return "9900E6FF";//黄
	if (srvs > 5 && srvs <= 20) return "9900C8FF";//橙黄
	if (srvs > 20 && srvs <= 50) return "990096FF";//橙色
	if (srvs > 50 && srvs <= 100) return "990064FF";//橙红
	if (srvs > 100 && srvs <= 200) return "990000FF";//红
	if (srvs > 200 && srvs <= 500) return "990000DC";//暗红
	if (srvs > 500) return "990000B4";//深暗红
}

String.prototype.format = String.prototype.f = function () {  
    var s = this,  
        i = arguments.length;  
  
    while (i--) {  
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);  
    }  
    return s;  
};

/**
 * 
 * @param {*} filed 字段名称
 * @param {*} rev 升/降
 * @param {*} primer 字段变量类型
 * 
 * 举例
 * var obj = [
 *     {b: '3', c: 'c'},
 *     {b: '1', c: 'a'},
 *     {b: '2', c: 'b'}
 * ];
 * //数字排序
 * obj.sort(sortBy('b', false, parseInt));
 * //字符排序
 * obj.sort(sortBy('b', false, String));
 */
var sortBy = function (filed, rev, primer) {
    rev = (rev) ? -1 : 1;
    return function (a, b) {
        a = a[filed];
        b = b[filed];
        if (typeof (primer) != 'undefined') {
            a = primer(a);
            b = primer(b);
        }
        if (a < b) { return rev * -1; }
        if (a > b) { return rev * 1; }
        return 1;
    }
};

function iconstylewith(icon, onlyid) {
	var id = "icon_" + icon;
	if (onlyid) return id;
	var defaultIcon = "http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png";
	var stationIcon = "https://maps.google.com/mapfiles/kml/shapes/ranger_station.png";
	var infoIcon = "http://maps.google.com/mapfiles/kml/shapes/info.png";
	var style = '\
	<Style id="normal_' + id + '">\n\
		<IconStyle>\n\
			<scale>1.1</scale>\n\
			<Icon><href>{0}</href></Icon>\n\
		</IconStyle>\n\
	</Style>\n\
	<Style id="highlight_' + id + '">\n\
		<IconStyle>\n\
			<scale>1.3</scale>\n\
			<Icon><href>{1}</href></Icon>\n\
		</IconStyle>\n\
	</Style>\n\
	<StyleMap id="' + id + '">\n\
		<Pair>\n\
			<key>normal</key>\n\
			<styleUrl>#normal_' + id + '</styleUrl>\n\
		</Pair>\n\
		<Pair>\n\
			<key>highlight</key>\n\
			<styleUrl>#highlight_' + id + '</styleUrl>\n\
		</Pair>\n\
	</StyleMap>\n\
	';
	switch (icon) {
	default:
	case "":
		style = style.format(defaultIcon, defaultIcon);
		break;
	case "station":
		style = style.format(stationIcon, stationIcon);
		break;
	case "info":
			style = style.format(infoIcon, infoIcon);
			break;
	}
	return style;
}

function linestylewith(total, per, onlyid) {
	var ext = '_' + total + '_' + per2color(per);
	var id = 'line' + ext;
	if (onlyid) return id;
	var style = '\
	<Style id="sn_line' + ext + '">\n\
		<LineStyle>\n\
			<color>' + per2color(per) + '</color>\n\
			<width>' + Math.ceil(parseFloat(total) / 72 * 0.5) + '</width>\n\
		</LineStyle>\n\
	</Style>\n\
	<Style id="sh_line' + ext + '">\n\
		<LineStyle>\n\
			<color>' + per2color(per) + '</color>\n\
			<width>' + Math.ceil(parseFloat(total) / 72 * 0.5) + '</width>\n\
		</LineStyle>\n\
	</Style>\n\
	<StyleMap id="' + id + '">\n\
		<Pair>\n\
			<key>normal</key>\n\
			<styleUrl>#sn_line' + ext + '</styleUrl>\n\
		</Pair>\n\
		<Pair>\n\
			<key>highlight</key>\n\
			<styleUrl>#sh_line' + ext + '</styleUrl>\n\
		</Pair>\n\
	</StyleMap>\n\
	';
	return style;
}

function ringstylewith(onlyid) {
	var ringstyleid = 'ringstyle';
	if (onlyid) return ringstyleid;
	var ringstyle = '<Style id="' + ringstyleid + '">\n\
			<LineStyle>\n\
				<color>' + per2color(0.8) + '</color>\n\
			</LineStyle>\n\
			<PolyStyle>\n\
				<fill>0</fill>\n\
			</PolyStyle>\n\
		</Style>\n\
	';
	return ringstyle;
}

function polygonstylewith(srvs, onlyid) {
	var ext = '_' + srvs2color(srvs);
	var id = 'polygon' + ext;
	if (onlyid) return id;
	var style = '\
	<Style id="' + id + '01">\n\
		<IconStyle>\n\
			<scale>1.3</scale>\n\
			<Icon>\n\
				<href>http://maps.google.com/mapfiles/kml/paddle/Z.png</href>\n\
			</Icon>\n\
			<hotSpot x="32" y="1" xunits="pixels" yunits="pixels"/>\n\
		</IconStyle>\n\
		<ListStyle>\n\
			<ItemIcon>\n\
				<href>http://maps.google.com/mapfiles/kml/paddle/Z-lv.png</href>\n\
			</ItemIcon>\n\
		</ListStyle>\n\
		<LineStyle>\n\
			<width>5</width>\n\
		</LineStyle>\n\
		<PolyStyle>\n\
			<color>' + srvs2color(srvs) + '</color>\n\
		</PolyStyle>\n\
	</Style>\n\
	<Style id="' + id + '02">\n\
		<IconStyle>\n\
			<scale>1.1</scale>\n\
			<Icon>\n\
				<href>http://maps.google.com/mapfiles/kml/paddle/Z.png</href>\n\
			</Icon>\n\
			<hotSpot x="32" y="1" xunits="pixels" yunits="pixels"/>\n\
		</IconStyle>\n\
		<ListStyle>\n\
			<ItemIcon>\n\
				<href>http://maps.google.com/mapfiles/kml/paddle/Z-lv.png</href>\n\
			</ItemIcon>\n\
		</ListStyle>\n\
		<LineStyle>\n\
			<width>5</width>\n\
		</LineStyle>\n\
		<PolyStyle>\n\
			<color>' + srvs2color(srvs) + '</color>\n\
		</PolyStyle>\n\
	</Style>\n\
	<StyleMap id="' + id + '">\n\
		<Pair>\n\
			<key>normal</key>\n\
			<styleUrl>#' + id + '02</styleUrl>\n\
		</Pair>\n\
		<Pair>\n\
			<key>highlight</key>\n\
			<styleUrl>#' + id + '01</styleUrl>\n\
		</Pair>\n\
	</StyleMap>\n\
	';
	return style;
}

function lonlat(sitecode, sites) {
	var ll = "";
	$.each(sites, function(n, site) {
		if (site.SITECODE == sitecode)
			ll = site.LON + "," + site.LAT;
			return;
	});
	if (ll != "") return ll;
	return null;
}

function sitewith(sitecode, sitedp, sites, styleid) {
	var ss = "";
	$.each(sites, function(n, site) {
		if (site.SITECODE == sitecode) {
			ss += '<Placemark>\n';
			ss += '<name>' + site.SITENAME + '</name>\n';
			if (styleid != "") {
				ss += '<styleUrl>#' + styleid + '</styleUrl>';
			}
			ss += '<gx:balloonVisibility>1</gx:balloonVisibility>';
			ss += '<ExtendedData>\n';
			ss += '<Data name="局站编码"><value>' + site.SITECODE + '</value></Data>\n';
			ss += '<Data name="所属分公司"><value>' + sitedp + '</value></Data>\n';
			ss += '</ExtendedData>\n';
			ss += '<Point><coordinates>\n';
			ss += site.LON + ',' + site.LAT;
			ss += '</coordinates></Point>\n';
			ss += '</Placemark>\n';
		}
	});
	if (ss != "") return ss;
	return null;
}

function timestampnow() {
	var now = new Date();
	var timeStamp = now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate() 
		+ "_" + now.getHours() + "." + (now.getMinutes() + 1) + "." + (now.getSeconds() + 1);
	return timeStamp;
}

var endswith = '\
	</Document>\n\
</kml>\
';
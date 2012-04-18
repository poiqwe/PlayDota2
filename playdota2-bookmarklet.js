(function(unsafeWindow){
	(function loadScript(callback){
		var head = document.getElementsByTagName('head')[0],
			data = document.createElement('script'),
			loaded = false;
		data.type = 'text/javascript';
		data.src = 'http://poiqwe.github.com/playdota2/data.js';
		data.onload = data.onreadystatechange = function() {
			if (!loaded && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				callback.call(unsafeWindow);
				data.onload = null;
				head.removeChild(data)
			}
		}
		head.appendChild(data);
	})(init);

	function init() {
		"use strict";
		
		replaceImages();
		if (/http:\/\/www\.playdota\.com\/(?:heroes|items)/.test(document.location.href)) {
			var list = document.querySelectorAll('.hdleft a, .ileft a');
			
			for (var i=list.length;i--;) {
				list[i].addEventListener("mouseover",replaceImages);
				list[i].addEventListener("click",replaceImages);
			}
		}
	}

	function replaceImages() {
		"use strict";
		
		var re = /playdota.com\/(?:img\/)?(hero|items)\/(\d+)\/+(icon|thumb|skill-\d)/, regex = RegExp,
			IMGUR = "http://i.imgur.com/", BITLY = "http://bit.ly/dota2-", GITHUB = "http://poiqwe.github.com/playdota2/skills/", EXTENSION = ".png",
			list,img,src,
			sizes = {
				thumb: 38,
				icon: 64
			},
			template = '<table><tr><td style="vertical-align:top"><img src="{0}" class="tooltip"/></td><td>{1}<br/>{2}</td></tr></table>',
			classes = ["http://i.imgur.com/y5iFD.png","http://i.imgur.com/NIAxG.png","http://i.imgur.com/lUNc4.png"],
			category,key,type,
			tooltip;
		
		list = document.querySelectorAll('img[src*="playdota.com"]');
		
		for (var i=list.length;i--;) {
			img = list[i];
			src = img.src;
			img.onerror = (function(i,s){return function(){i.src=s;};})(img,src);
			
			if (/tooltip/.test(img.className) || !re.test(src)) continue;
			
			category = regex.$1; // hero | items
			key = regex.$2; // integer
			type  = regex.$3; // icon | thumb | skill-0
			
			if (!parseInt(key,10)) continue;
			
			img.width = sizes.hasOwnProperty(type) ? sizes[type] : img.width;
			img.height = sizes.hasOwnProperty(type) ? sizes[type] : img.height;
			if (data.hasOwnProperty(category) && !!data[category][key] && !!data[category][key].imgur) {
				if (type.match(/skill-\d+/) != null) {
					img.src = GITHUB + key + "/" + type + EXTENSION;
				} else {
					var args, sub = data[category][key];
					
					img.src = IMGUR + sub.imgur + EXTENSION;
					
					if (category == "hero") args = [classes[sub.hclass-1],sub.name,sub.name2];
					else args = [src,'<b>'+sub.name+'</b>','<img src="http://i.imgur.com/HHHUl.jpg"/>'+sub.price+'<br/>'+sub.bonus];
					
					tooltip = document.createElement('div');
					tooltip.innerHTML = format(template,args);
					tooltip.setAttribute('id',category+key);
					tooltip.style.backgroundColor="black";
					tooltip.style.position="absolute";
					
					img.addEventListener('mouseover', (function(t) {
						return function(e) {
							document.body.appendChild(t);
							t.style.top = (e.pageY + 10)+"px";
							t.style.left = (e.pageX + 30)+"px";
						};
					})(tooltip),true);
					
					img.addEventListener('mousemove', (function(id) {
						return function(e) {
							var t = document.getElementById(id);
							t.style.top = (e.pageY + 10)+"px";
							t.style.left = (e.pageX + 30)+"px";
						};
					})(category+key),true);
					
					img.addEventListener('mouseout', (function(id) {
						return function(e) {
							var t = document.getElementById(id);
							document.body.removeChild(t);
						};
					})(category+key),true);
				}
			}
		}
	}
	
	function format(a,b){return a.replace(/\{([^}]+)\}/g,function(a,c){return b.hasOwnProperty(c)?b[c]:a})};
})(window);
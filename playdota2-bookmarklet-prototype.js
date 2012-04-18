(function(unsafeWindow){
	(function loadScript(callback){
		var head = $(document.getElementsByTagName('head')[0]),
			script = $(document.createElement('script'));
		script.type = 'text/javascript';
		script.src = 'http://poiqwe.github.com/playdota2/data.js';
		script.onload = script.onreadystatechange = function() {
			if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
				callback.call(unsafeWindow);
				script.onload = script.onreadystatechange = null;
				script.remove();
			}
		}
		head.insert(script);
	})(init);

	function init() {
		'use strict';
		
		replaceImages();
		if (/http:\/\/www\.playdota\.com\/(?:heroes|items)/.test(document.location.href)) {
			var list = $$('.hdleft a, .ileft a');
			
			list.each(function(a,index) {
				$(a)
					.observe('mouseover',replaceImages)
					.observe('click',replaceImages);
			});
		}
	}
	
	function replaceImages() {
		'use strict';
		
		var re = /playdota.com\/(?:img\/)?(hero|items)\/(\d+)\/+(icon|thumb|skill-\d)/, regex = RegExp,
			IMGUR = 'http://i.imgur.com/', BITLY = 'http://bit.ly/dota2-', GITHUB = 'http://poiqwe.github.com/playdota2/skills/', EXTENSION = '.png',
			list,img,src,
			sizes = {
				thumb: 38,
				icon: 64
			},
			template = '<table><tr><td style=\'vertical-align:top\'><img src=\'{0}\' class=\'tooltip\'/></td><td>{1}<br/>{2}</td></tr></table>',
			classes = ['http://i.imgur.com/y5iFD.png','http://i.imgur.com/NIAxG.png','http://i.imgur.com/lUNc4.png'],
			category,key,type,
			tooltip;
		
		list = $$('img[src*=\'playdota.com\']');
		
		list.each(function(img,index) {
			src = img.src;
			img.observe('error',(function(i,s){return function(){i.src=s;};})(img,src));
			
			if (img.hasClassName('tooltip') || !re.test(src)) return;
			
			category = regex.$1; // hero | items
			key = regex.$2; // integer
			type  = regex.$3; // icon | thumb | skill-0
			
			if (!parseInt(key,10)) return;
			
			img.width = sizes.hasOwnProperty(type) ? sizes[type] : img.width;
			img.height = sizes.hasOwnProperty(type) ? sizes[type] : img.height;
			if (data.hasOwnProperty(category) && !!data[category][key] && !!data[category][key].imgur) {
				if (type.match(/skill-\d+/) != null) {
					img.src = GITHUB + key + '/' + type + EXTENSION;
				} else {
					var args, sub = data[category][key];
					
					img.src = IMGUR + sub.imgur + EXTENSION;
					
					if (category == 'hero') args = [classes[sub.hclass-1],sub.name,sub.name2];
					else args = [src,'<b>'+sub.name+'</b>','<img src=\'http://i.imgur.com/HHHUl.jpg\'/>'+sub.price+'<br/>'+sub.bonus];
					
					tooltip = $(document.createElement('div'));
					tooltip
						.writeAttribute('id', category+key)
						.setStyle({
							backgroundColor:'black',
							position:'absolute'
						})
						.innerHTML = format(template, args);
					
					img.observe('mouseover', (function(t) {
						return function(e) {
							document.body.appendChild(t);
							!!t && t.setStyle({
								top: (e.pageY + 10)+'px',
								left: (e.pageX + 30)+'px'
							});
						};
					})(tooltip));
					
					img.observe('mousemove', (function(id) {
						return function(e) {
							var t = $(id);
							!!t && t.setStyle({
								top: (e.pageY + 10)+'px',
								left: (e.pageX + 30)+'px'
							});
						};
					})(category+key));
					
					img.observe('mouseout', (function(id) {
						return function(e) {
							var t = $(id);
							!!t && t.remove();
						};
					})(category+key));
				}
			}
		});
	}
	
	function format(a,b){return a.replace(/\{([^}]+)\}/g,function(a,c){return b.hasOwnProperty(c)?b[c]:a})};
})(window);
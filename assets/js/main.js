(function(){
	const yearEl=document.getElementById('year');
	if(yearEl){yearEl.textContent=String(new Date().getFullYear());}

	const toggle=document.querySelector('.nav-toggle');
	const menu=document.getElementById('primary-menu');
	if(toggle&&menu){
		toggle.addEventListener('click',()=>{
			const open=menu.classList.toggle('open');
			toggle.setAttribute('aria-expanded', open? 'true':'false');
		});
	}

	// Smooth scroll for on-page anchors
	document.querySelectorAll('a[href^="#"]').forEach(a=>{
		a.addEventListener('click',e=>{
			const id=a.getAttribute('href');
			if(id&&id!=='#'){
				const target=document.querySelector(id);
				if(target){
					e.preventDefault();
					target.scrollIntoView({behavior:'smooth'});
					target.setAttribute('tabindex','-1');
					target.focus({preventScroll:true});
				}
			}
		});
	});

	// Back to top
	const back=document.getElementById('backToTop');
	if(back){
		window.addEventListener('scroll',()=>{
			back.style.display=window.scrollY>400?'inline-block':'none';
		});
		back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
	}
})();

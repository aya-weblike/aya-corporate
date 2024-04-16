/*-------------------------------------------
共通
-------------------------------------------*/
//ページスクロールでふわっと表示
//監視対象が範囲内に現れたら実行する動作
const animateFade = (entries,obs) =>{
	entries.forEach((entry => {
		if(entry.isIntersecting){
			entry.target.animate(
				{
					opacity:[0,1],
					filter:['blur(.4rem)' , 'blur(0)'],
					translate:['0 4rem',0],
				},
				{
					duration:2000,
					easing:'ease',
					fill:'forwards',
				}
			);
			//一度ふわっとさせたら、監視をやめる
			obs.unobserve(entry.target);
		}
	}));
};

//監視設定
const fadeObserver = new IntersectionObserver(animateFade);

//.fadeinを監視するよう指示
const fadeElements = document.querySelectorAll('.fadein');

fadeElements.forEach((fadeElement) =>{
	fadeObserver.observe(fadeElement);
});

/*-------------------------------------------
ページごとの処理
-------------------------------------------*/
let path = location.pathname; // パス部分だけ取得
let paths = path.split('/'); // スラッシュで分解して配列にする
let file = paths[paths.length-1]; // 最後の要素を取得する

// 検索対象の文字列
let subject = file;

if (subject.indexOf('job') !== -1) {
	// URLに'job'が含まれている時（募集要項のページ）
	//監視対象が範囲内に現れたら実行する動作
	const timeLineFade = (shows,obs) =>{
		shows.forEach((show) => {
			if(show.isIntersecting){
				// 上から順に表示させる
				const timeLineItems = document.querySelectorAll('.timeline-item');

				timeLineItems.forEach((timeLine,index) => {
					timeLine.animate(
						{
							opacity:[0,1],
							filter:['blur(.4rem)','blur(0)'],
							translate:['0 4rem' ,0],
						},
						{
							duration:2000,
							delay:300*index,
							easing:'ease',
							fill:'forwards',
						}
					);
					// 一度ふわっとさせたら監視をやめる
					obs.unobserve(show.target);
				});
			}
		});
	};

	// 監視設定
	const timeLineObserver = new IntersectionObserver(timeLineFade);

	// .timeline-itemを監視するよう指示
	const timeLineElement = document.querySelector('.timeline');
	timeLineObserver.observe(timeLineElement);

}else if(subject.indexOf('form') !== -1){
	// URLに'form'が含まれている時（応募のページ）
	// 文字数のカウント
	const text = document.querySelector('#pr');
	const count = document.querySelector('#count');

	text.addEventListener('keyup',() => {
		count.textContent=text.value.length;
		// 400文字を超えるなら
		if (text.value.length > 400){
			count.classList.add('alert');
		}else{
			count.classList.remove('alert');
		}
	});

	// 個人情報の同意
	const isAgreed = document.querySelector('#check');
	const btn = document.querySelector('#btn');

	isAgreed.addEventListener('change',()=>{
		btn.disabled=!isAgreed.checked;
	});
}else{
	// ホームページのみに適用される処理
	const loadingAreaGrey = document.querySelector('#loading');
	const loadingAreaGreen = document.querySelector('#loading-screen');
	const loadingText = document.querySelector('#loading p');

	window.addEventListener('load',() =>{
		// ローディング中（グレースクリーン）
		loadingAreaGrey.animate(
			{
				opacity: [1,0],
				visibility: 'hidden',
			},
			{
				duration:2000,
				delay:1200,
				easing:'ease',
				fill:'forwards',
			}
		);
		// ローディング中（緑スクリーン）
		loadingAreaGreen.animate(
			{
				translate:['0 100vh','0 0','0 -100vh']
			},
			{
				duration:2000,
				delay:800,
				easing:'ease',
				fill:'forwards',
			}
		);
		// ローディング中（テキスト）
		loadingText.animate(
			[
				{
					opacity:1,
					offset:.8 //80%
				},
				{
					opacity:0,
					offset:1 //100%
				},
			],
			{
				duration:1200,
				easing:'ease',
				fill:'forwards'
			}
		);
	});

	// PIE CHART
	var pieData = {
		labels:['住宅関連' , '医療・健康' , 'ライフサポート' , '慶弔関連' , 'その他'],
		series:[45 , 20, 25, 10]
	};
	var pieOptions ={
		width:'100%',
		height:'440px'
	};
	new Chartist.Pie('.pie-chart' , pieData , pieOptions);

	// BAR CHART
	var barData = {
		labels:['2020年','2021年','2022年'],
		series:[[30,45,60]]
	};
	var barOptions = {
		axisY:{
			offset:60,
			scaleMinSpace: 50,
			labelInterpolationFnc: function(value) {
				return value + '%'
			}
		},
		width:'100%',
		height:'400px'
	};
	new Chartist.Bar('.bar-chart', barData, barOptions);	
};

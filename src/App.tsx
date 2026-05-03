import { useState, useMemo } from 'react';

const C = {
  bg: '#FFF8F3', surface: '#FFFFFF', primary: '#EA580C', primaryLight: '#FFF3EC',
  text: '#1C1917', textSub: '#78716C', textMuted: '#A8A29E', border: '#E7E5E4',
  green: '#16A34A', greenBg: '#F0FDF4', red: '#DC2626', yellow: '#D97706',
};

const PAGES = [
  { id: 'sales', label: '売上管理' },
  { id: 'products', label: '商品管理' },
  { id: 'price', label: '価格計算' },
  { id: 'desc', label: '商品説明文' },
  { id: 'instagram', label: 'Instagram投稿' },
  { id: 'faq', label: '返信テンプレート' },
];

const CATEGORIES = ['ニット帽', 'マフラー・ストール', 'バッグ・かごバッグ', '手袋・ミトン', 'アクセサリー', 'インテリア小物', 'その他'];
const TONES = ['ナチュラル・シンプル', 'かわいい・ガーリー', '高級感・上質', '北欧・スカンジナビア'];
const PLATFORMS = ['minne', 'Creema', 'BASE', 'その他'];
const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const POST_TYPES = [
  { id: 'new', label: '新商品告知', desc: '新しい作品をお披露目' },
  { id: 'restock', label: '再入荷・補充', desc: '売り切れ商品が戻った告知' },
  { id: 'process', label: '制作過程', desc: '制作の様子を発信' },
  { id: 'season', label: '季節・イベント', desc: 'ギフト需要を狙った投稿' },
  { id: 'review', label: 'お客様の声', desc: 'レビューをシェア' },
  { id: 'daily', label: '日常・ブランド発信', desc: '世界観を伝える投稿' },
];
const SEASONS = ['春（3〜5月）', '夏（6〜8月）', '秋（9〜11月）', '冬（12〜2月）'];
const EVENTS = ['バレンタイン', '母の日', 'クリスマス', 'お正月', '入学・卒業', '誕生日プレゼント'];

const faqTemplates = [
  { category: '購入前', items: [
    { title: '在庫・納期について', situation: '「在庫はありますか？」', template: 'お問い合わせいただきありがとうございます。\n\nご質問の商品は現在在庫がございます。ご購入いただきましたら、2〜3営業日以内に発送いたします。\n\nご不明な点がございましたら、お気軽にご連絡ください。' },
    { title: 'サイズ感について', situation: '「サイズ感はどのくらいですか？」', template: 'お問い合わせいただきありがとうございます。\n\nフリーサイズとなっており、頭周り約56〜59cmの方にお使いいただけます。伸縮性のある素材ですので、幅広い方にフィットします。\n\nご不明な点がありましたら、お気軽にご質問ください。' },
    { title: '素材・洗濯方法について', situation: '「洗濯できますか？」', template: 'お問い合わせいただきありがとうございます。\n\n手洗いまたはネットに入れての洗濯機（ドライコース）をおすすめしています。乾燥機のご使用はお避けください。\n\nご不明な点がありましたら、またいつでもご連絡ください。' },
    { title: 'プレゼント用ラッピング', situation: '「プレゼント用にできますか？」', template: 'お問い合わせいただきありがとうございます。\n\nプレゼント用のラッピング対応も承っております。ご購入の際に備考欄に「プレゼント用希望」とご記入いただけますと、丁寧にお包みしてお届けいたします。' },
    { title: 'カスタム対応（しない場合）', situation: '「色やサイズを変えてもらえますか？」', template: 'お問い合わせいただきありがとうございます。\n\n大変恐れ入りますが、現在はカスタムオーダーの対応が難しい状況です。今後対応できるようになりましたら、ぜひご利用いただけますと嬉しいです。' },
    { title: 'カスタム対応（要相談）', situation: '「色やサイズを変えてもらえますか？」', template: 'お問い合わせいただきありがとうございます。\n\n内容によってはご対応できる場合がございます。ご希望の詳細をお知らせいただけますでしょうか？確認のうえ、改めてご連絡いたします。' },
  ]},
  { category: '発送関連', items: [
    { title: '発送完了のご連絡', situation: '商品を発送したとき', template: 'この度はご購入いただきありがとうございます。\n\n本日、商品を発送いたしました。\n【発送方法】ネコポス\n【追跡番号】（番号を記入）\n\n到着まで2〜3日ほどお待ちください。またのご利用をお待ちしております。' },
    { title: '到着確認のお礼', situation: '「届きました」と連絡が来たとき', template: 'お受け取りいただけて、ほっといたしました。\n\n気に入っていただけましたら、とても嬉しいです。またのご利用を心よりお待ちしております。' },
    { title: '配送遅延のお詫び', situation: '発送が遅れてしまったとき', template: 'この度はご購入いただきありがとうございます。\n\n発送が遅くなってしまい、大変申し訳ございません。本日発送いたしましたので、もう少々お待ちいただけますと幸いです。' },
  ]},
  { category: 'トラブル対応', items: [
    { title: '商品未着のお問い合わせ', situation: '「まだ届いていません」と連絡が来たとき', template: 'ご連絡いただきありがとうございます。\n\nお届けが遅れており、大変ご不便をおかけして申し訳ございません。追跡番号にて配送状況をご確認いただけますでしょうか。\n\n【追跡番号】（番号を記入）' },
    { title: '商品に問題があった場合', situation: '「不具合がある」と連絡が来たとき', template: 'ご連絡いただきありがとうございます。\n\nこの度はご不便をおかけして大変申し訳ございません。商品の状態がわかる写真をお送りいただけますでしょうか？内容を確認のうえ、誠意をもって対応いたします。' },
  ]},
  { category: 'レビュー対応', items: [
    { title: '良いレビューをもらったとき', situation: '高評価のレビューが届いたとき', template: '素敵なレビューをいただき、ありがとうございます。\n\n気に入っていただけてとても嬉しく、励みになります。またのご利用を心よりお待ちしております。' },
    { title: 'リピーターへのお礼', situation: '以前も購入してくれた方が再度購入したとき', template: 'またご利用いただきありがとうございます。\n\nリピートしていただけてとても嬉しいです。今回もご満足いただけるよう、心を込めてお届けします。' },
  ]},
];

const SAMPLE_SALES = [
  { id: 1, date: '2026-01-15', product: 'ニット帽（ネイビー）', category: 'ニット帽', platform: 'minne', price: 5500, cost: 2300, shipping: 280 },
  { id: 2, date: '2026-02-03', product: 'マフラー（オフホワイト）', category: 'マフラー・ストール', platform: 'minne', price: 8800, cost: 3200, shipping: 280 },
  { id: 3, date: '2026-03-05', product: 'かごバッグ（ナチュラル）', category: 'バッグ・かごバッグ', platform: 'minne', price: 14000, cost: 5500, shipping: 280 },
];

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'ニット帽（ネイビー）', category: 'ニット帽', material: 'アクリル', color: 'ネイビー', size: 'フリー', stock: 3, price: 5500, cost: 2300, shipping: 280, status: '出品中' },
  { id: 2, name: 'マフラー（オフホワイト）', category: 'マフラー・ストール', material: 'メリノウール', color: 'オフホワイト', size: 'フリー', stock: 2, price: 8800, cost: 3200, shipping: 280, status: '出品中' },
  { id: 3, name: 'かごバッグ（ナチュラル）', category: 'バッグ・かごバッグ', material: 'コットン', color: 'ナチュラル', size: 'M', stock: 1, price: 14000, cost: 5500, shipping: 280, status: '出品中' },
];

function calcProfit(s: any) { return s.price - s.cost - s.shipping - Math.floor(s.price * 0.10659); }
function fmt(n: number) { return `¥${Number(n).toLocaleString()}`; }

function generateDesc(form: any) {
  const toneMap: any = {
    'ナチュラル・シンプル': { adj: 'シンプルで飽きのこない', feel: '日常になじむ', catch: 'シンプルに、日常になじむ' },
    'かわいい・ガーリー': { adj: 'ふんわりキュートな', feel: '気分が上がる', catch: 'ふんわり、気分が上がる' },
    '高級感・上質': { adj: '上品で洗練された', feel: '特別感を演出する', catch: '上質な手仕事を、毎日に' },
    '北欧・スカンジナビア': { adj: '北欧テイストの洗練された', feel: '北欧インテリアにも映える', catch: '北欧の風を、手のひらに' },
  };
  const t = toneMap[form.tone] || toneMap['ナチュラル・シンプル'];
  const price = form.price ? `¥${Number(form.price).toLocaleString()}` : '';
  return {
    title: `手編み ${form.category}｜${form.color}・${form.material}`.slice(0, 30),
    catchcopy: `${t.catch}${form.category}`,
    desc: `ひとつひとつ丁寧に手編みした、${t.adj}${form.category}です。\n\n素材には${form.material}を使用しており、${form.color}カラーが${t.feel}一品に仕上がっています。${form.size ? `サイズは${form.size}で、幅広い方にお使いいただけます。` : ''}${form.appeal ? `\n\n${form.appeal}` : ''}\n\n大切な方へのプレゼントにも、自分へのご褒美にもぴったりの一品です。${price ? `\n\n価格：${price}` : ''}`,
    tags: [`#${form.category}`, '#ハンドメイド', '#手編み', `#${form.material}`, `#${form.color}`, '#minne', '#ニット雑貨', '#ていねいな暮らし', '#handmade', '#手作り'],
  };
}

function generatePost(type: string, form: any) {
  const tags = [`#${form.category||'ニット帽'}`, '#ハンドメイド', '#手編み', '#ニット雑貨', '#minneで販売中', '#ハンドメイド好きな人と繋がりたい', '#ていねいな暮らし', '#handmade', '#knitting', '#手作り'];
  const price = form.price ? `¥${Number(form.price).toLocaleString()}` : '';
  const posts: any = {
    new: `新作のご紹介です。\n\n【${form.category}】${form.color ? ` ${form.color}` : ''}${form.material ? ` / ${form.material}` : ''}${price ? `\n価格：${price}` : ''}\n\nひとつひとつ丁寧に手編みした作品です。シンプルで毎日使いたくなるデザインに仕上げました。\n\nminneにて販売中です。\n\n${[...tags, '#新作'].join(' ')}`,
    restock: `お待たせしました。再入荷のお知らせです。\n\n${form.category ? `【${form.category}】` : ''}${form.color ? ` ${form.color}` : ''}が再び入荷しました。\n\nminneにてお待ちしています。\n\n${[...tags, '#再入荷'].join(' ')}`,
    process: `制作中の様子をちょこっとお見せします。\n\n${form.category}を編んでいます。${form.material ? `素材は${form.material}を使用。` : ''}ひと目ひと目丁寧に編み進めています。\n\n完成したらまた投稿しますね。\n\n${[...tags, '#制作中'].join(' ')}`,
    season: `${form.season || 'この季節'}にぴったりの作品をご紹介します。${form.event ? `\n${form.event}のギフトにもおすすめです。` : ''}\n\n【${form.category}】${form.color ? ` ${form.color}` : ''}${price ? `\n価格：${price}` : ''}\n\nminneにて販売中。\n\n${[...tags, form.event ? `#${form.event}ギフト` : '#季節ギフト'].join(' ')}`,
    review: `嬉しいお声をいただきました。\n\n${form.reviewText ? `"${form.reviewText}"` : '「丁寧な梱包で、とても気に入っています」とのお声をいただきました。'}\n\nこういったお言葉が一番の励みになっています。\n\n${[...tags, '#お客様の声'].join(' ')}`,
    daily: `${form.dailyTheme || '今日も手を動かしながら、ひとつひとつ丁寧に。'}\n\n編み物をしていると、無心になれる時間があって、それがすごく好きです。\n\n今日もご覧いただきありがとうございます。\n\n${[...tags, '#暮らしを楽しむ'].join(' ')}`,
  };
  return posts[type] || '';
}

const inp = { width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#FAFAF9', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', color: C.text };
const lbl = { display: 'block', fontSize: 12, fontWeight: '600', color: C.textSub, marginBottom: 5 };

// ===== 折れ線グラフ（家計ノート風）=====
function LineChart({ data }: { data: { month: string; revenue: number; profit: number }[] }) {
  const W = 340, H = 180, PL = 52, PR = 20, PT = 20, PB = 36;
  const IW = W - PL - PR, IH = H - PT - PB;
  const maxVal = Math.max(...data.map(d => d.revenue), 1);
  const toX = (i: number) => PL + (i / Math.max(data.length - 1, 1)) * IW;
  const toY = (v: number) => PT + IH - (v / maxVal) * IH;

  const revenuePolyline = data.map((d, i) => `${toX(i)},${toY(d.revenue)}`).join(' ');
  const profitPolyline = data.map((d, i) => `${toX(i)},${toY(d.profit)}`).join(' ');

  // グラデーション塗りつぶし用パス
  const revenueFillPath = data.length > 1
    ? `M${toX(0)},${toY(data[0].revenue)} ` +
      data.slice(1).map((d, i) => `L${toX(i+1)},${toY(d.revenue)}`).join(' ') +
      ` L${toX(data.length-1)},${PT+IH} L${toX(0)},${PT+IH} Z`
    : '';

  const yTicks = 4;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((maxVal / yTicks) * i));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.primary} stopOpacity="0.25" />
          <stop offset="100%" stopColor={C.primary} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.green} stopOpacity="0.15" />
          <stop offset="100%" stopColor={C.green} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* グリッド線・Y軸ラベル */}
      {yLabels.map((v, i) => {
        const y = toY(v);
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#E7E5E4" strokeWidth={1} />
            <text x={PL - 6} y={y + 4} fontSize={9} fill={C.textMuted} textAnchor="end" fontFamily="sans-serif">
              {v >= 10000 ? `${(v / 10000).toFixed(1)}万` : v >= 1000 ? `${(v / 1000).toFixed(0)},000` : `${v}`}
            </text>
          </g>
        );
      })}

      {/* X軸ラベル */}
      {data.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 6} fontSize={10} fill={C.textSub} textAnchor="middle" fontFamily="sans-serif" fontWeight="500">
          {d.month}月
        </text>
      ))}

      {/* 売上グラデーション塗りつぶし */}
      {revenueFillPath && <path d={revenueFillPath} fill="url(#revGrad)" />}

      {/* 売上ライン */}
      {data.length > 1 && (
        <polyline points={revenuePolyline} fill="none" stroke={C.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      )}

      {/* 利益ライン */}
      {data.length > 1 && (
        <polyline points={profitPolyline} fill="none" stroke={C.green} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6,3" />
      )}

      {/* 売上ドット */}
      {data.map((d, i) => (
        <g key={`rv-${i}`}>
          <circle cx={toX(i)} cy={toY(d.revenue)} r={5} fill="#fff" stroke={C.primary} strokeWidth={2.5} />
        </g>
      ))}

      {/* 利益ドット */}
      {data.map((d, i) => (
        <g key={`pf-${i}`}>
          <circle cx={toX(i)} cy={toY(d.profit)} r={4} fill="#fff" stroke={C.green} strokeWidth={2} />
        </g>
      ))}
    </svg>
  );
}

// ===== 価格計算ページ =====
function PricePage() {
  const [settings, setSettings] = useState({ hourlyWage: 1500, targetProfit: 30, feeRate: 10.659, shippingCost: 280, multiplyRate: 3 });
  const [form, setForm] = useState({ materialCost: '', workHours: '', mode: 'detail' });
  const [showSettings, setShowSettings] = useState(false);
  const setSetting = (k: string, v: number) => setSettings(s => ({ ...s, [k]: v }));
  const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const result = useMemo(() => {
    const mat = Number(form.materialCost) || 0;
    const hours = Number(form.workHours) || 0;
    if (mat === 0) return null;
    if (form.mode === 'detail') {
      const laborCost = hours * settings.hourlyWage;
      const totalCost = mat + laborCost + settings.shippingCost;
      const rate = 1 - (settings.targetProfit / 100) - (settings.feeRate / 100);
      const recommended = Math.ceil(totalCost / rate / 100) * 100;
      const fee = Math.floor(recommended * settings.feeRate / 100);
      const profit = recommended - mat - laborCost - settings.shippingCost - fee;
      return { recommended, totalCost, laborCost, fee, profit, profitRate: Math.round((profit / recommended) * 100), mat, mode: 'detail' };
    } else {
      const recommended = Math.ceil((mat * settings.multiplyRate + settings.shippingCost) / 100) * 100;
      const fee = Math.floor(recommended * settings.feeRate / 100);
      const profit = recommended - mat - settings.shippingCost - fee;
      return { recommended, fee, profit, profitRate: Math.round((profit / recommended) * 100), mat, mode: 'multiply' };
    }
  }, [form, settings]);
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 12, overflow: 'hidden' }}>
        <button onClick={() => setShowSettings(!showSettings)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: '700', color: C.text }}>計算ロジックの設定</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>{showSettings ? '閉じる ▲' : '変更する ▼'}</span>
        </button>
        {showSettings && (
          <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
              {[{ label: '時給（円）', key: 'hourlyWage', value: settings.hourlyWage }, { label: '目標利益率（%）', key: 'targetProfit', value: settings.targetProfit }, { label: 'minne手数料率（%）', key: 'feeRate', value: settings.feeRate }, { label: '送料・梱包費（円）', key: 'shippingCost', value: settings.shippingCost }, { label: '倍率計算の倍率', key: 'multiplyRate', value: settings.multiplyRate }].map(s => (
                <div key={s.key}><label style={lbl}>{s.label}</label><input type="number" style={inp} value={s.value} onChange={e => setSetting(s.key, Number(e.target.value))} /></div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {[{ id: 'detail', label: '詳細積み上げ型', desc: '材料費＋時給＋利益率から算出' }, { id: 'multiply', label: '倍率型', desc: `材料費×${settings.multiplyRate}倍で簡単算出` }].map(m => (
          <button key={m.id} onClick={() => setF('mode', m.id)} style={{ padding: '14px 12px', borderRadius: 12, border: `2px solid ${form.mode === m.id ? C.primary : C.border}`, background: form.mode === m.id ? C.primaryLight : C.surface, cursor: 'pointer', textAlign: 'left' as const }}>
            <div style={{ fontSize: 13, fontWeight: '700', color: form.mode === m.id ? C.primary : C.text, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{m.desc}</div>
          </button>
        ))}
      </div>
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 16 }}>商品情報を入力</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: '1/-1' }}><label style={lbl}>材料費（円）</label><input type="number" style={inp} value={form.materialCost} onChange={e => setF('materialCost', e.target.value)} placeholder="例：1500" /></div>
          {form.mode === 'detail' && <div style={{ gridColumn: '1/-1' }}><label style={lbl}>制作時間（時間）</label><input type="number" style={inp} value={form.workHours} onChange={e => setF('workHours', e.target.value)} placeholder="例：3" /></div>}
        </div>
      </div>
      {result && (
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ background: C.primary, padding: '20px 16px', textAlign: 'center' as const }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 4, fontWeight: '600' }}>推奨販売価格</div>
            <div style={{ fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: '-1.5px' }}>{fmt(result.recommended)}</div>
          </div>
          <div style={{ padding: 16 }}>
            {[
              { label: '材料費', value: fmt(result.mat), color: C.text },
              ...(result.mode === 'detail' ? [{ label: `制作費（${form.workHours}時間×時給${fmt(settings.hourlyWage)}）`, value: fmt((result as any).laborCost), color: C.text }] : []),
              { label: '送料・梱包費', value: fmt(settings.shippingCost), color: C.text },
              { label: 'minne手数料', value: `-${fmt(result.fee)}`, color: C.red },
              { label: '純利益', value: `+${fmt(result.profit)}`, color: C.green },
              { label: '実質利益率', value: `${result.profitRate}%`, color: result.profitRate >= 30 ? C.green : C.yellow },
            ].map((row, i, a) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < a.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <span style={{ fontSize: 13, color: C.textSub }}>{row.label}</span>
                <span style={{ fontSize: 14, fontWeight: '700', color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DescPage() {
  const [form, setForm] = useState({ category: 'ニット帽', material: 'アクリル', color: 'ネイビー・ブルー', size: 'フリーサイズ（大人）', tone: 'ナチュラル・シンプル', price: '5500', appeal: '' });
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<any>({});
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const copy = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopied((c: any) => ({ ...c, [key]: true })); setTimeout(() => setCopied((c: any) => ({ ...c, [key]: false })), 2000); };
  return (
    <div style={{ padding: 16, maxWidth: 680, margin: '0 auto' }}>
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 16 }}>商品情報を入力</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={lbl}>商品カテゴリ</label><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label style={lbl}>素材</label><input style={inp} value={form.material} onChange={e => set('material', e.target.value)} /></div>
          <div><label style={lbl}>カラー</label><input style={inp} value={form.color} onChange={e => set('color', e.target.value)} /></div>
          <div><label style={lbl}>サイズ</label><input style={inp} value={form.size} onChange={e => set('size', e.target.value)} /></div>
          <div><label style={lbl}>ブランドトーン</label><select style={inp} value={form.tone} onChange={e => set('tone', e.target.value)}>{TONES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label style={lbl}>販売価格（円）</label><input style={inp} type="number" value={form.price} onChange={e => set('price', e.target.value)} /></div>
          <div style={{ gridColumn: '1/-1' }}><label style={lbl}>アピールポイント（任意）</label><textarea style={{ ...inp, resize: 'none' as const, height: 64 }} value={form.appeal} onChange={e => set('appeal', e.target.value)} /></div>
        </div>
      </div>
      <button onClick={() => setResult(generateDesc(form))} style={{ width: '100%', padding: 13, background: C.primary, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: '700', cursor: 'pointer', marginBottom: 16 }}>説明文を生成する</button>
      {result && (
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}><span style={{ fontSize: 13, fontWeight: '700', color: C.text }}>生成結果</span></div>
          {[{ key: 'title', label: '商品タイトル', text: result.title }, { key: 'catch', label: 'キャッチコピー', text: result.catchcopy }, { key: 'desc', label: '商品説明文', text: result.desc }].map(({ key, label, text }) => (
            <div key={key} style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: '600', color: C.textSub }}>{label}</span>
                <button onClick={() => copy(key, text)} style={{ padding: '4px 12px', background: copied[key] ? C.textMuted : C.primary, color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: '600', cursor: 'pointer' }}>{copied[key] ? 'コピー済み' : 'コピー'}</button>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: C.text, background: C.bg, padding: '10px 12px', borderRadius: 8, whiteSpace: 'pre-wrap' }}>{text}</div>
            </div>
          ))}
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: '600', color: C.textSub }}>推奨ハッシュタグ</span>
              <button onClick={() => copy('tags', result.tags.join(' '))} style={{ padding: '4px 12px', background: copied['tags'] ? C.textMuted : C.primary, color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: '600', cursor: 'pointer' }}>{copied['tags'] ? 'コピー済み' : 'コピー'}</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{result.tags.map((tag: string) => <span key={tag} style={{ background: C.primaryLight, color: C.primary, borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: '600' }}>{tag}</span>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function InstagramPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [form, setForm] = useState({ category: 'ニット帽', material: '', color: '', price: '', season: '', event: '', reviewText: '', dailyTheme: '' });
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ padding: 16, maxWidth: 680, margin: '0 auto' }}>
      {step === 1 && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{POST_TYPES.map(t => <button key={t.id} onClick={() => { setSelectedType(t.id); setStep(2); }} style={{ padding: '14px 12px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, cursor: 'pointer', textAlign: 'left' as const }}><div style={{ fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 4 }}>{t.label}</div><div style={{ fontSize: 11, color: C.textMuted }}>{t.desc}</div></button>)}</div>}
      {step === 2 && (
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 16 }}>{POST_TYPES.find(t => t.id === selectedType)?.label} — 詳細を入力</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {['new','restock','season'].includes(selectedType) && <><div><label style={lbl}>商品カテゴリ</label><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div><div><label style={lbl}>カラー</label><input style={inp} value={form.color} onChange={e => set('color', e.target.value)} placeholder="例：ネイビー" /></div><div><label style={lbl}>素材</label><input style={inp} value={form.material} onChange={e => set('material', e.target.value)} placeholder="例：アクリル" /></div><div><label style={lbl}>価格（円）</label><input style={inp} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="5500" /></div></>}
            {selectedType === 'season' && <><div><label style={lbl}>季節</label><select style={inp} value={form.season} onChange={e => set('season', e.target.value)}><option value="">選択</option>{SEASONS.map(s => <option key={s}>{s}</option>)}</select></div><div><label style={lbl}>イベント（任意）</label><select style={inp} value={form.event} onChange={e => set('event', e.target.value)}><option value="">なし</option>{EVENTS.map(ev => <option key={ev}>{ev}</option>)}</select></div></>}
            {selectedType === 'review' && <div style={{ gridColumn: '1/-1' }}><label style={lbl}>レビュー文（任意）</label><textarea style={{ ...inp, height: 80, resize: 'none' as const }} value={form.reviewText} onChange={e => set('reviewText', e.target.value)} /></div>}
            {selectedType === 'daily' && <div style={{ gridColumn: '1/-1' }}><label style={lbl}>今日のひとこと（任意）</label><input style={inp} value={form.dailyTheme} onChange={e => set('dailyTheme', e.target.value)} placeholder="例：今日は新しい色糸を試してみました" /></div>}
            {selectedType === 'process' && <><div><label style={lbl}>制作中の商品</label><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div><div><label style={lbl}>素材</label><input style={inp} value={form.material} onChange={e => set('material', e.target.value)} placeholder="例：メリノウール" /></div></>}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, fontSize: 13, cursor: 'pointer', color: C.textSub }}>戻る</button>
            <button onClick={() => { setResult(generatePost(selectedType, form)); setStep(3); }} style={{ flex: 2, padding: 12, borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: '700', cursor: 'pointer' }}>投稿文を生成する</button>
          </div>
        </div>
      )}
      {step === 3 && <><div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16, marginBottom: 10 }}><div style={{ fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 10 }}>生成された投稿文</div><pre style={{ fontSize: 13, lineHeight: 1.9, color: C.text, whiteSpace: 'pre-wrap', background: C.bg, padding: 14, borderRadius: 10, margin: '0 0 12px' }}>{result}</pre><button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ width: '100%', padding: 12, background: copied ? C.textMuted : C.primary, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: '700', cursor: 'pointer' }}>{copied ? 'コピー済み' : '投稿文をコピー'}</button></div><div style={{ display: 'flex', gap: 8 }}><button onClick={() => setStep(2)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, fontSize: 13, cursor: 'pointer', color: C.textSub }}>修正する</button><button onClick={() => { setStep(1); setResult(''); setCopied(false); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: '700', cursor: 'pointer' }}>別の投稿を作る</button></div></>}
    </div>
  );
}

function FaqPage() {
  const [activeCat, setActiveCat] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const allItems = faqTemplates.flatMap((cat, ci) => cat.items.map((item, ii) => ({ ...item, ci, ii, catLabel: cat.category })));
  const filtered = search ? allItems.filter(i => i.title.includes(search) || i.situation.includes(search)) : null;
  const current = filtered ? filtered[0] : faqTemplates[activeCat]?.items[activeItem];
  const copy = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2000); };
  return (
    <div style={{ padding: 16, maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="キーワードで検索（例：サイズ、発送）" style={inp} /></div>
      {filtered ? (filtered.length === 0 ? <div style={{ padding: 20, color: C.textMuted }}>該当なし</div> : filtered.map((item, i) => <div key={i} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16, marginBottom: 10 }}><div style={{ fontSize: 11, color: C.textMuted }}>{item.catLabel}</div><div style={{ fontSize: 14, fontWeight: '700', color: C.text, margin: '4px 0' }}>{item.title}</div><div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>使うシーン：{item.situation}</div><pre style={{ fontSize: 13, lineHeight: 1.8, color: C.text, whiteSpace: 'pre-wrap', background: C.bg, padding: 12, borderRadius: 8, margin: '0 0 10px' }}>{item.template}</pre><button onClick={() => copy(`s${i}`, item.template)} style={{ width: '100%', padding: '9px', background: copiedKey === `s${i}` ? C.textMuted : C.primary, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: '600', cursor: 'pointer' }}>{copiedKey === `s${i}` ? 'コピー済み' : 'コピーする'}</button></div>)) : (
        <><div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>{faqTemplates.map((cat, i) => <button key={i} onClick={() => { setActiveCat(i); setActiveItem(0); }} style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${activeCat === i ? C.primary : C.border}`, background: activeCat === i ? C.primary : C.surface, color: activeCat === i ? '#fff' : C.textSub, fontSize: 12, fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>{cat.category}</button>)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 10 }}><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{faqTemplates[activeCat].items.map((item, i) => <button key={i} onClick={() => setActiveItem(i)} style={{ padding: '10px 12px', borderRadius: 10, border: `1px solid ${activeItem === i ? C.primary : C.border}`, background: activeItem === i ? C.primaryLight : C.surface, color: activeItem === i ? C.primary : C.text, fontSize: 12, fontWeight: activeItem === i ? '700' : '500', cursor: 'pointer', textAlign: 'left' as const }}>{item.title}</button>)}</div>
        {current && <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 14 }}><div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>使うシーン：{current.situation}</div><pre style={{ fontSize: 12, lineHeight: 1.8, color: C.text, whiteSpace: 'pre-wrap', background: C.bg, padding: 10, borderRadius: 8, margin: '0 0 10px', minHeight: 100 }}>{current.template}</pre><button onClick={() => copy('main', current.template)} style={{ width: '100%', padding: '9px', background: copiedKey === 'main' ? C.textMuted : C.primary, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: '600', cursor: 'pointer' }}>{copiedKey === 'main' ? 'コピー済み' : 'コピーする'}</button></div>}</div></>
      )}
    </div>
  );
}

function SalesPage() {
  const [sales, setSales] = useState(SAMPLE_SALES);
  const [showForm, setShowForm] = useState(false);
  const [filterMonth, setFilterMonth] = useState('all');
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState({ date: '', product: '', category: 'ニット帽', platform: 'minne', price: '', cost: '', shipping: '280' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const addSale = () => { if (!form.date || !form.product || !form.price) return; setSales(s => [{ ...form, id: Date.now(), price: +form.price, cost: +(form.cost||0), shipping: +(form.shipping||280) }, ...s]); setForm({ date: '', product: '', category: 'ニット帽', platform: 'minne', price: '', cost: '', shipping: '280' }); setShowForm(false); };
  const filtered = useMemo(() => filterMonth === 'all' ? sales : sales.filter(s => new Date(s.date).getMonth() === +filterMonth), [sales, filterMonth]);
  const stats = useMemo(() => {
    const totalRevenue = filtered.reduce((a, s) => a + s.price, 0);
    const totalProfit = filtered.reduce((a, s) => a + calcProfit(s), 0);
    const totalFee = filtered.reduce((a, s) => a + Math.floor(s.price * 0.10659), 0);
    const totalCost = filtered.reduce((a, s) => a + s.cost + s.shipping, 0);
    const byMonth: any = {};
    sales.forEach(s => { const m = new Date(s.date).getMonth(); if (!byMonth[m]) byMonth[m] = { revenue: 0, profit: 0, count: 0 }; byMonth[m].revenue += s.price; byMonth[m].profit += calcProfit(s); byMonth[m].count++; });
    return { totalRevenue, totalProfit, totalFee, totalCost, count: filtered.length, byMonth };
  }, [filtered, sales]);
  const profitRate = stats.totalRevenue ? Math.round((stats.totalProfit / stats.totalRevenue) * 100) : 0;

  const chartData = MONTHS.map((month, i) => {
    const d = (stats.byMonth as any)[i];
    return { month: `${i + 1}`, revenue: d ? d.revenue : 0, profit: d ? d.profit : 0, hasData: !!d };
  }).filter(d => d.hasData);

  const STABS = [{ id: 'overview', label: '概要' }, { id: 'monthly', label: '月別' }, { id: 'list', label: '明細' }];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex' }}>{STABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '11px 14px', border: 'none', background: 'transparent', fontSize: 13, fontWeight: tab === t.id ? '700' : '500', color: tab === t.id ? C.primary : C.textSub, borderBottom: tab === t.id ? `2px solid ${C.primary}` : '2px solid transparent', cursor: 'pointer' }}>{t.label}</button>)}</div>
        <button onClick={() => setShowForm(true)} style={{ padding: '7px 14px', background: C.primary, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: '600', cursor: 'pointer' }}>+ 追加</button>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: C.textSub }}>期間</span>
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ ...inp, width: 'auto', padding: '6px 10px', fontSize: 13 }}><option value="all">全期間</option>{MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: C.textMuted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 10px' }}>{filtered.length}件</span>
        </div>

        {tab === 'overview' && <>
          <div style={{ background: C.primary, borderRadius: 14, padding: 20, marginBottom: 12, color: '#fff' }}>
            <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4, letterSpacing: '0.8px', textTransform: 'uppercase' as const, fontWeight: '600' }}>総売上</div>
            <div style={{ fontSize: 34, fontWeight: '800', letterSpacing: '-1.5px', marginBottom: 14 }}>{fmt(stats.totalRevenue)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[{ label: '純利益', value: fmt(stats.totalProfit), sub: `利益率 ${profitRate}%` }, { label: '手数料', value: fmt(stats.totalFee), sub: '10.659%' }, { label: '件数', value: `${stats.count}件`, sub: stats.count ? fmt(Math.round(stats.totalRevenue / stats.count)) + '/件' : '—' }].map(k => <div key={k.label} style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 10, padding: '10px 12px' }}><div style={{ fontSize: 10, opacity: 0.75, marginBottom: 3, fontWeight: '600' }}>{k.label}</div><div style={{ fontSize: 15, fontWeight: '700' }}>{k.value}</div><div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{k.sub}</div></div>)}
            </div>
          </div>
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}><span style={{ fontSize: 13, fontWeight: '700', color: C.text }}>売上内訳</span></div>
            {[{ label: '売上合計', value: stats.totalRevenue, color: C.text, sign: '' }, { label: '原価・送料', value: stats.totalCost, color: C.red, sign: '-' }, { label: 'minne手数料', value: stats.totalFee, color: C.red, sign: '-' }, { label: '純利益', value: stats.totalProfit, color: C.green, sign: '+', bold: true }].map((r, i, a) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', borderBottom: i < a.length - 1 ? `1px solid ${C.border}` : 'none', background: r.bold ? C.greenBg : 'transparent' }}><span style={{ fontSize: 13, color: r.bold ? C.text : C.textSub, fontWeight: r.bold ? '700' : '400' }}>{r.label}</span><span style={{ fontSize: 14, fontWeight: '700', color: r.color }}>{r.sign}{fmt(r.value)}</span></div>)}
          </div>
        </>}

        {tab === 'monthly' && (
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            {/* ヘッダー */}
            <div style={{ padding: '16px 16px 12px' }}>
              <div style={{ fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 8 }}>月別売上推移</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 3, background: C.primary, borderRadius: 2 }} />
                  <span style={{ fontSize: 11, color: C.textSub, fontWeight: '500' }}>売上</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="24" height="3"><line x1="0" y1="1.5" x2="24" y2="1.5" stroke={C.green} strokeWidth="2" strokeDasharray="5,3" /></svg>
                  <span style={{ fontSize: 11, color: C.textSub, fontWeight: '500' }}>利益</span>
                </div>
              </div>
            </div>

            {/* グラフ */}
            {chartData.length >= 2 ? (
              <div style={{ padding: '0 16px 12px' }}>
                <LineChart data={chartData} />
              </div>
            ) : (
              <div style={{ padding: '20px 16px', color: C.textMuted, fontSize: 13, textAlign: 'center' as const }}>
                データが2件以上になるとグラフが表示されます
              </div>
            )}

            {/* 区切り線 */}
            <div style={{ borderTop: `1px solid ${C.border}` }} />

            {/* 月別サマリー */}
            <div style={{ padding: '8px 0' }}>
              <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: '700', color: C.textMuted, letterSpacing: '0.5px' }}>月別サマリー</div>
              {MONTHS.map((m, i) => {
                const d = (stats.byMonth as any)[i];
                if (!d) return null;
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: '600', color: C.text }}>{m}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{d.count}件</div>
                    </div>
                    <div style={{ textAlign: 'right' as const }}>
                      <div style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{fmt(d.revenue)}</div>
                      <div style={{ fontSize: 11, color: C.green, fontWeight: '600', marginTop: 2 }}>利益 {fmt(d.profit)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'list' && <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}><div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}><span style={{ fontSize: 13, fontWeight: '700', color: C.text }}>売上明細</span></div>{filtered.length === 0 ? <div style={{ padding: 16, color: C.textMuted }}>データなし</div> : filtered.map((s, i, a) => <div key={s.id} style={{ padding: '12px 16px', borderBottom: i < a.length - 1 ? `1px solid ${C.border}` : 'none' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontSize: 13, fontWeight: '600', color: C.text }}>{s.product}</div><div style={{ display: 'flex', gap: 6, marginTop: 3 }}><span style={{ fontSize: 11, color: C.textMuted }}>{s.date}</span><span style={{ fontSize: 11, background: C.primaryLight, color: C.primary, borderRadius: 4, padding: '1px 6px', fontWeight: '600' }}>{s.platform}</span></div></div><div style={{ textAlign: 'right' as const }}><div style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{fmt(s.price)}</div><div style={{ fontSize: 11, color: C.green, fontWeight: '600' }}>+{fmt(calcProfit(s))}</div></div></div><button onClick={() => setSales(p => p.filter(x => x.id !== s.id))} style={{ marginTop: 8, padding: '3px 8px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 11, color: C.textMuted, cursor: 'pointer' }}>削除</button></div>)}</div>}
      </div>
      {showForm && <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }} onClick={() => setShowForm(false)}><div style={{ background: C.surface, borderRadius: '20px 20px 0 0', padding: '24px 20px', width: '100%', maxWidth: 680, margin: '0 auto', boxSizing: 'border-box' as const }} onClick={e => e.stopPropagation()}><div style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 20 }}>売上を追加</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div style={{ gridColumn: '1/-1' }}><label style={lbl}>日付</label><input type="date" style={inp} value={form.date} onChange={e => set('date', e.target.value)} /></div><div style={{ gridColumn: '1/-1' }}><label style={lbl}>商品名</label><input style={inp} value={form.product} onChange={e => set('product', e.target.value)} placeholder="例：ニット帽（ネイビー）" /></div><div><label style={lbl}>カテゴリ</label><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div><div><label style={lbl}>プラットフォーム</label><select style={inp} value={form.platform} onChange={e => set('platform', e.target.value)}>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select></div><div><label style={lbl}>販売価格（円）</label><input type="number" style={inp} value={form.price} onChange={e => set('price', e.target.value)} placeholder="5500" /></div><div><label style={lbl}>原価（円）</label><input type="number" style={inp} value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="2300" /></div><div style={{ gridColumn: '1/-1' }}><label style={lbl}>送料・梱包費（円）</label><input type="number" style={inp} value={form.shipping} onChange={e => set('shipping', e.target.value)} placeholder="280" /></div></div><div style={{ display: 'flex', gap: 8, marginTop: 20 }}><button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 13, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, fontSize: 14, cursor: 'pointer', color: C.textSub }}>キャンセル</button><button onClick={addSale} style={{ flex: 2, padding: 13, borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: '700', cursor: 'pointer' }}>追加する</button></div></div></div>}
    </div>
  );
}

function ProductsPage() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', category: 'ニット帽', material: '', color: '', size: '', stock: '', price: '', cost: '', shipping: '280', status: '出品中' });
  const STATUSES = ['出品中', '準備中', '非公開', '受注のみ'];
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const openAdd = () => { setEditId(null); setForm({ name: '', category: 'ニット帽', material: '', color: '', size: '', stock: '', price: '', cost: '', shipping: '280', status: '出品中' }); setShowForm(true); };
  const openEdit = (p: any) => { setEditId(p.id); setForm({ name: p.name, category: p.category, material: p.material, color: p.color, size: p.size, stock: String(p.stock), price: String(p.price), cost: String(p.cost), shipping: String(p.shipping), status: p.status }); setShowForm(true); };
  const save = () => { if (!form.name || !form.price) return; const item = { ...form, id: editId || Date.now(), stock: +form.stock, price: +form.price, cost: +form.cost, shipping: +form.shipping }; if (editId) { setProducts(p => p.map(x => x.id === editId ? item : x)); } else { setProducts(p => [item, ...p]); } setShowForm(false); };
  const profit = (p: any) => p.price - p.cost - p.shipping - Math.floor(p.price * 0.10659);
  const profitRate = (p: any) => p.price ? Math.round((profit(p) / p.price) * 100) : 0;
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: '700', color: C.text }}>商品一覧 {products.length}件</span>
        <button onClick={openAdd} style={{ padding: '7px 14px', background: C.primary, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: '600', cursor: 'pointer' }}>+ 商品追加</button>
      </div>
      <div style={{ padding: 16 }}>
        {products.map((p) => (
          <div key={p.id} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 4 }}>{p.name}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                  <span style={{ fontSize: 11, background: C.primaryLight, color: C.primary, borderRadius: 4, padding: '1px 6px', fontWeight: '600' }}>{p.status}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{p.category}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{p.material}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{p.color}</span>
                </div>
              </div>
              <button onClick={() => openEdit(p)} style={{ padding: '5px 12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.textSub, cursor: 'pointer' }}>編集</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
              {[{ label: '販売価格', value: fmt(p.price), color: C.text }, { label: '純利益', value: fmt(profit(p)), color: C.green }, { label: '利益率', value: `${profitRate(p)}%`, color: profitRate(p) >= 30 ? C.green : C.yellow }, { label: '在庫数', value: `${p.stock}点`, color: p.stock === 0 ? C.red : C.text }].map(k => (
                <div key={k.label} style={{ background: C.bg, borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2, fontWeight: '600' }}>{k.label}</div>
                  <div style={{ fontSize: 13, fontWeight: '700', color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showForm && <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }} onClick={() => setShowForm(false)}><div style={{ background: C.surface, borderRadius: '20px 20px 0 0', padding: '24px 20px', width: '100%', maxWidth: 680, margin: '0 auto', boxSizing: 'border-box' as const, maxHeight: '90vh', overflowY: 'auto' as const }} onClick={e => e.stopPropagation()}><div style={{ fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 20 }}>{editId ? '商品を編集' : '商品を追加'}</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div style={{ gridColumn: '1/-1' }}><label style={lbl}>商品名</label><input style={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="例：ニット帽（ネイビー）" /></div><div><label style={lbl}>カテゴリ</label><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div><div><label style={lbl}>ステータス</label><select style={inp} value={form.status} onChange={e => set('status', e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div><div><label style={lbl}>素材</label><input style={inp} value={form.material} onChange={e => set('material', e.target.value)} placeholder="例：アクリル" /></div><div><label style={lbl}>カラー</label><input style={inp} value={form.color} onChange={e => set('color', e.target.value)} placeholder="例：ネイビー" /></div><div><label style={lbl}>サイズ</label><input style={inp} value={form.size} onChange={e => set('size', e.target.value)} placeholder="例：フリー" /></div><div><label style={lbl}>在庫数</label><input type="number" style={inp} value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="3" /></div><div><label style={lbl}>販売価格（円）</label><input type="number" style={inp} value={form.price} onChange={e => set('price', e.target.value)} placeholder="5500" /></div><div><label style={lbl}>原価（円）</label><input type="number" style={inp} value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="2300" /></div><div><label style={lbl}>送料・梱包費（円）</label><input type="number" style={inp} value={form.shipping} onChange={e => set('shipping', e.target.value)} placeholder="280" /></div></div><div style={{ display: 'flex', gap: 8, marginTop: 20 }}><button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 13, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, fontSize: 14, cursor: 'pointer', color: C.textSub }}>キャンセル</button><button onClick={save} style={{ flex: 2, padding: 13, borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: '700', cursor: 'pointer' }}>{editId ? '保存する' : '追加する'}</button></div></div></div>}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('sales');
  return (
    <div style={{ fontFamily: "'Helvetica Neue', -apple-system, sans-serif", background: C.bg, minHeight: '100vh' }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: '700', color: C.primary }}>ショップ管理ツール</div>
          </div>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {PAGES.map(p => <button key={p.id} onClick={() => setPage(p.id)} style={{ padding: '11px 14px', border: 'none', background: 'transparent', fontSize: 13, fontWeight: page === p.id ? '700' : '500', color: page === p.id ? C.primary : C.textSub, borderBottom: page === p.id ? `2px solid ${C.primary}` : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>{p.label}</button>)}
          </div>
        </div>
      </div>
      {page === 'sales' && <SalesPage />}
      {page === 'products' && <ProductsPage />}
      {page === 'price' && <PricePage />}
      {page === 'desc' && <DescPage />}
      {page === 'instagram' && <InstagramPage />}
      {page === 'faq' && <FaqPage />}
    </div>
  );
}
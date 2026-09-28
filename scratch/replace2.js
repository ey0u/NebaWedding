const fs = require('fs');

let c = fs.readFileSync('components/wedding/invitation.tsx', 'utf8');

c = c.replace(/{wedding\.displayDate}/g, '{t.date.displayDate}');
c = c.replace(/<span>05<\/span>\s*<small>OCTOBER<\/small>\s*<span>2026<\/span>/, '<span>{t.date.day}</span><small>{t.date.month}</small><span>{t.date.year}</span>');
c = c.replace(/<span className="eyebrow">Chapter two<\/span>/, '<span className="eyebrow">{t.timeline.eyebrow}</span>');
c = c.replace(/<h2>Our day<\/h2>/, '<h2>{t.timeline.title}</h2>');
c = c.replace(/\{\s*\[[\s\S]*?\]\.map\(\(\[time, title, desc\]\) => \(/, '{t.timeline.events.map(({time, title, desc}) => (');
c = c.replace(/<h2>\s*Where there is love,\s*<br \/>\s*<i>there is life\.<\/i>\s*<\/h2>/, '<h2>{t.quoteSection.quote.split(\'\\n\').map((line, i) => <span key={i}>{i === 1 ? <i>{line}</i> : line}<br/></span>)}</h2>');
c = c.replace(/<p>— Mahatma Gandhi<\/p>/, '<p>{t.quoteSection.author}</p>');
c = c.replace(/<div className="venue-label">A place to gather<\/div>/, '<div className="venue-label">{t.venue.imageLabel}</div>');
c = c.replace(/<span className="eyebrow">Chapter three<\/span>/, '<span className="eyebrow">{t.venue.eyebrow}</span>');
c = c.replace(/<h2>\s*Where we begin\s*<br \/>\s*<i>forever\.<\/i>\s*<\/h2>/, '<h2>{t.venue.title.split(\'\\n\').map((line, i) => <span key={i}>{i === 1 ? <i>{line}</i> : line}<br/></span>)}</h2>');
c = c.replace(/{wedding\.venue}/g, '{t.venue.name}');
c = c.replace(/{wedding\.location}/g, '{t.venue.location}');
c = c.replace(/<span>{t\.date\.displayDate} · 10:00<\/span>/, '<span>{t.date.displayDate} · {t.venue.time}</span>');
c = c.replace(/Open in maps/, '{t.venue.openInMaps}');
c = c.replace(/<span className="eyebrow">The next chapter<\/span>/, '<span className="eyebrow">{t.finalSection.eyebrow}</span>');
c = c.replace(/<h2>\s*We can&apos;t wait to\s*<br \/>\s*celebrate with you\.\s*<\/h2>/, '<h2>{t.finalSection.title.split(\'\\n\').map((line, i) => <span key={i}>{line}<br/></span>)}</h2>');
c = c.replace(/{wedding\.bride} & {wedding\.groom}/g, '{t.hero.name2} & {t.hero.name1}');
c = c.replace(/<small>Forever starts here\.<\/small>/, '<small>{t.finalSection.subtitle}</small>');

fs.writeFileSync('components/wedding/invitation.tsx', c);
console.log('Replaced all hardcoded text!');

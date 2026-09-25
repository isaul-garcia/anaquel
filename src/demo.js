const site = (id, title, url) => ({ id, title, url, dateAdded: 1700000000000 + Number(id) * 1000 });
export function demoTree() {
  return { id: '0', title: '', children: [
    { id: '1', title: 'Bookmarks bar', folderType: 'bookmarks-bar', children: [
      { id: '10', title: 'Daily rituals', children: [site('101', 'Are.na', 'https://www.are.na'), site('102', 'Notion', 'https://notion.so'), site('103', 'Read.cv', 'https://read.cv'), site('104', 'Spotify', 'https://open.spotify.com')] },
      { id: '11', title: 'Design inspiration', children: [site('105', 'Cosmos', 'https://cosmos.so'), site('106', 'Pinterest', 'https://pinterest.com'), site('107', 'Awwwards', 'https://awwwards.com'), site('108', 'Dribbble', 'https://dribbble.com'), { id: '20', title: 'Typography', children: [site('109', 'Google Fonts', 'https://fonts.google.com'), site('110', 'Typewolf', 'https://typewolf.com')] }] },
      { id: '12', title: 'The workshop', children: [site('111', 'Figma', 'https://figma.com'), site('112', 'CodePen', 'https://codepen.io'), site('113', 'GitHub', 'https://github.com'), site('114', 'Framer', 'https://framer.com')] },
      { id: '13', title: 'Something to read', children: [site('115', 'Wikipedia', 'https://wikipedia.org'), site('116', 'The Creative Independent', 'https://thecreativeindependent.com'), site('117', 'It’s Nice That', 'https://itsnicethat.com')] },
      { id: '14', title: 'Off the clock', children: [site('118', 'Letterboxd', 'https://letterboxd.com'), site('119', 'YouTube', 'https://youtube.com'), site('120', 'itch.io', 'https://itch.io')] },
      { id: '15', title: 'Little discoveries', children: [site('121', 'Earth', 'https://earth.google.com'), site('122', 'Neal.fun', 'https://neal.fun'), site('123', 'Internet Archive', 'https://archive.org'), site('124', 'NASA', 'https://nasa.gov')] }
    ] },
    { id: '2', title: 'Other bookmarks', folderType: 'other', children: [] }
  ] };
}

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const policy = require('../initial-course-policy');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const start = html.indexOf('    async function playLesson(lessonId) {');
const playerCode = html.slice(start, html.indexOf('    function closeVideoPlayer()', start));

function playerFixture(count, other = false, paid = false) {
  const course = {id: other ? 'other-course' : policy.COURSE_ID, releaseType:'immediate', lessons:Array.from({length:count}, (_, i) => ({id:i+1,contentId:'l'+(i+1),videoId:'video-'+i,title:'Clase '+(i+1),isPreview:true}))};
  const elements = new Map(); const requests = []; const views = [];
  const context = {
    COURSES:[course], currentCourseId:course.id, DermalysseInitialCourse:policy,
    isCourseUnlocked:() => ({unlocked:paid}), courseReleaseState:() => ({unlocked:true}), _tieneAcceso:() => paid,
    showToast() {}, goTo:view => views.push(view),
    document:{body:{style:{}},getElementById(id) {if (!elements.has(id)) elements.set(id,{style:{},classList:{add(){}}});return elements.get(id);}},
    auth:{currentUser:{getIdToken:async () => 'fixture-token'}}, WEBHOOK_SERVER:'https://backend.invalid',
    fetch:async (_, request) => {requests.push(JSON.parse(request.body));return {ok:true,json:async () => ({embedUrl:'about:blank',playbackSessionId:'fixture'})};},
    startBunnyProgressTracking() {}, window:{}
  };
  vm.createContext(context); vm.runInContext(playerCode, context);
  return {context,requests,views};
}

for (const count of [0,1,2,8]) test(`reproductor real: ${count} clases, última requiere pago`, async () => {
  const fixture=playerFixture(count);
  for (let i=1;i<=Math.max(1,count);i++) await fixture.context.playLesson(i);
  assert.equal(fixture.requests.length,Math.max(0,count-1));
  assert.equal(fixture.views.length,count ? 1 : 0);
});

test('otras clases con isPreview legado no alcanzan el backend sin pago', async () => {
  const fixture=playerFixture(8,true);
  for (let i=1;i<=8;i++) await fixture.context.playLesson(i);
  assert.equal(fixture.requests.length,0);
  assert.equal(fixture.views.length,8);
});

test('el reproductor conserva acceso de miembros a última clase y otros cursos', async () => {
  for (const other of [false,true]) {
    const fixture=playerFixture(2,other,true);
    await fixture.context.playLesson(2);
    assert.equal(fixture.requests.length,1);
    assert.equal(fixture.views.length,0);
  }
});

test('JavaScript inline válido y precios solo en suscripción', () => {
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new vm.Script(script[1]);
  const authSection=html.slice(html.indexOf('<div id="authScreen"'),html.indexOf('<div id="appScreen"'));
  assert.doesNotMatch(authSection,/\$\s*\d|auth-precio-/);
  assert.match(html,/id="plan-precio-mes"/);
  assert.match(html,/MembershipTour\.mount/);
});

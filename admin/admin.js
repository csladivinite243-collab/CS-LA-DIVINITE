'use strict';
const SUPABASE_URL='https://pqiuzymqshdxjtiztssx.supabase.co';
const SUPABASE_KEY='sb_publishable_LTM8tWga_CQXUSsW2tYmug_RJ93XsbY';
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=s=>document.querySelector(s);
let content=null;
const longKeys=new Set(['bienvenue','histoire','mission','vision','valeurs','approche','inscription','reglement']);
function message(el,text,kind=''){el.textContent=text;el.className='msg '+kind}
function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function drawSettings(){
 const root=$('#settingsForm');
 root.innerHTML=Object.entries(content.settings).map(([k,v])=>'<label class="'+(longKeys.has(k)?'long':'')+'">'+esc(k.replaceAll('_',' '))+(longKeys.has(k)?'<textarea data-key="'+esc(k)+'">'+esc(v)+'</textarea>':'<input data-key="'+esc(k)+'" value="'+esc(v)+'">')+'</label>').join('');
}
function drawItems(){ $('#itemsJson').value=JSON.stringify(content.items,null,2); }
async function loadContent(){
 const r=await fetch('/api/site',{cache:'no-store'});if(!r.ok)throw new Error('Impossible de charger le contenu du site.');
 content=await r.json();drawSettings();drawItems();
}
async function showDashboard(user){
 const {data,error}=await db.from('site_admins').select('user_id').eq('user_id',user.id).maybeSingle();
 if(error||!data){await db.auth.signOut();throw new Error('Ce compte ne possède pas les droits administrateur.');}
 $('#login').hidden=true;$('#dashboard').hidden=false;$('#who').textContent=user.email||'Administrateur';
 await loadContent();
}
$('#loginForm').addEventListener('submit',async e=>{
 e.preventDefault();message($('#loginMsg'),'Connexion…');
 const {data,error}=await db.auth.signInWithPassword({email:$('#email').value.trim(),password:$('#password').value});
 if(error){message($('#loginMsg'),error.message,'error');return;}
 try{await showDashboard(data.user)}catch(err){message($('#loginMsg'),err.message,'error')}
});
$('#logout').onclick=async()=>{await db.auth.signOut();location.reload()};
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));
 ['settings','items','media'].forEach(k=>$('#'+k+'Pane').hidden=k!==b.dataset.tab);
});
$('#saveSettings').onclick=async()=>{
 for(const el of $('#settingsForm').querySelectorAll('[data-key]'))content.settings[el.dataset.key]=el.value;
 const {data:{session}}=await db.auth.getSession();
 const r=await fetch('/api/site',{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token},body:JSON.stringify({content})});
 const j=await r.json().catch(()=>({}));
 message($('#settingsMsg'),r.ok?'Informations enregistrées. Le site public est mis à jour.':(j.error||'Échec de l’enregistrement.'),r.ok?'ok':'error');
};
$('#saveItems').onclick=async()=>{
 let items;try{items=JSON.parse($('#itemsJson').value);if(!Array.isArray(items))throw new Error('Le contenu doit être une liste JSON.');}catch(e){message($('#itemsMsg'),'JSON invalide : '+e.message,'error');return;}
 content.items=items;
 const {data:{session}}=await db.auth.getSession();
 const r=await fetch('/api/site',{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token},body:JSON.stringify({content})});
 const j=await r.json().catch(()=>({}));
 message($('#itemsMsg'),r.ok?'Contenus enregistrés. Le site public est mis à jour.':(j.error||'Échec de l’enregistrement.'),r.ok?'ok':'error');
};
$('#uploadForm').onsubmit=async e=>{
 e.preventDefault();const file=$('#mediaFile').files[0];if(!file)return;
 if(file.size>5*1024*1024){message($('#mediaMsg'),'Fichier trop volumineux (maximum 5 Mo).','error');return;}
 const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
 const path=Date.now()+'-'+crypto.randomUUID()+'.'+ext;
 message($('#mediaMsg'),'Import en cours…');
 const {error}=await db.storage.from('site-media').upload(path,file,{contentType:file.type,upsert:false});
 if(error){message($('#mediaMsg'),error.message,'error');return;}
 const {data}=db.storage.from('site-media').getPublicUrl(path);
 $('#mediaResult').innerHTML='<p>Image importée. Copiez cette adresse dans le champ image correspondant :</p><div class="media-url">'+esc(data.publicUrl)+'</div><button id="copyMedia" type="button">Copier l’adresse</button>';
 $('#copyMedia').onclick=()=>navigator.clipboard.writeText(data.publicUrl);
 message($('#mediaMsg'),'Import réussi.','ok');e.target.reset();
};
(async()=>{
 const {data:{session}}=await db.auth.getSession();
 if(session){try{await showDashboard(session.user)}catch(e){message($('#loginMsg'),e.message,'error')}}
 db.auth.onAuthStateChange(async(_event,s)=>{if(!s){$('#dashboard').hidden=true;$('#login').hidden=false;}});
})();
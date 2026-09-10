const KEY="lp_school_v1";
let editingStudent=null;
const today=()=>new Date().toISOString().slice(0,10);
const defaultData={
 settings:{schoolName:"Collège Le Pionnier",currency:"FC",defaultFees:1200000,theme:"light"},
 students:[
  {id:"ELV001",name:"Mwamba Kabeya",birth:"2010-04-12",sex:"Masculin",class:"2e",parent:"Jean Kabeya",phone:"+243 000 000 001",fees:1200000},
  {id:"ELV002",name:"Dulcinée Kalume",birth:"2011-01-20",sex:"Féminin",class:"3e",parent:"Marie Kalume",phone:"+243 000 000 002",fees:1200000},
  {id:"ELV003",name:"Joackim Mumba",birth:"2010-09-03",sex:"Masculin",class:"1e",parent:"Paul Mumba",phone:"+243 000 000 003",fees:1200000},
  {id:"ELV004",name:"Béatrice Mukendi",birth:"2012-02-17",sex:"Féminin",class:"4e",parent:"Anne Mukendi",phone:"+243 000 000 004",fees:1200000}
 ],
 teachers:[
  {id:"ENS001",name:"M. Kaleve",subject:"Mine & géologie",phone:"+243 000 000 010"},
  {id:"ENS002",name:"Mme Kabongo",subject:"Mathématiques",phone:"+243 000 000 011"},
  {id:"ENS003",name:"M. Ilunga",subject:"Physique",phone:"+243 000 000 012"}
 ],
 classes:[
  {name:"7e",section:"Secondaire",students:0},
  {name:"8e",section:"Secondaire",students:0},
  {name:"1e",section:"Secondaire",students:0},
  {name:"2e",section:"Secondaire",students:0},
  {name:"3e",section:"Secondaire",students:0},
  {name:"4e",section:"Secondaire",students:0}
 ],
 payments:[
  {id:"REC001",studentId:"ELV001",amount:450000,date:"2026-09-02",method:"Mobile Money",ref:"PAY-001"},
  {id:"REC002",studentId:"ELV002",amount:700000,date:"2026-09-04",method:"Espèces",ref:"PAY-002"},
  {id:"REC003",studentId:"ELV003",amount:300000,date:"2026-09-08",method:"Virement",ref:"PAY-003"}
 ],
 registrations:[
  {id:"INS001",name:"Mwamba Kabeya",class:"2e",option:"GÉO-MINE",date:"2026-09-01",status:"Validée"},
  {id:"INS002",name:"Dulcinée Kalume",class:"3e",option:"Générale",date:"2026-09-02",status:"Validée"},
  {id:"INS003",name:"Joackim Mumba",class:"1e",option:"Laboratoire chimique",date:"2026-09-05",status:"En attente"}
 ],
 grades:[
  {studentId:"ELV001",period:"Trimestre 1",average:15.5},
  {studentId:"ELV002",period:"Trimestre 1",average:14.2},
  {studentId:"ELV003",period:"Trimestre 1",average:16.1}
 ],
 announcements:[
  {id:"ANN001",title:"Bienvenue au portail du Collège Le Pionnier",text:"Les inscriptions et le suivi administratif sont désormais centralisés dans cet espace.",date:"2026-09-01"},
  {id:"ANN002",title:"Année scolaire 2026–2027",text:"Consultez les informations du collège et les horaires auprès de l'administration.",date:"2026-09-03"}
 ]
};
let data=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(defaultData)}catch(e){return structuredClone(defaultData)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function money(n){return new Intl.NumberFormat("fr-FR").format(Number(n)||0)+" "+data.settings.currency}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("toast-show");setTimeout(()=>t.classList.remove("toast-show"),2500)}
function login(){if(document.getElementById("loginUser").value==="admin"&&document.getElementById("loginPass").value==="pionnier"){sessionStorage.lp=1;start()}else toast("Identifiants incorrects")}
function logout(){sessionStorage.removeItem("lp");location.reload()}
function start(){document.getElementById("loginScreen").classList.add("hidden");document.getElementById("app").classList.remove("hidden");document.body.classList.toggle("dark",data.settings.theme==="dark");showPage("dashboard")}
if(sessionStorage.lp)start();

function toggleSidebar(){document.querySelector(".layout").classList.toggle("sidebar-open")}
function toggleTheme(){data.settings.theme=data.settings.theme==="dark"?"light":"dark";document.body.classList.toggle("dark");save();toast("Thème changé")}
function showPage(page){
 document.querySelectorAll(".nav-item[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
 const pages={dashboard:dashboardPage,students:studentsPage,teachers:teachersPage,classes:classesPage,payments:paymentsPage,registrations:registrationsPage,grades:gradesPage,announcements:announcementsPage,public:publicPage};
 document.getElementById("main").innerHTML=pages[page]();if(window.innerWidth<720)document.querySelector(".layout").classList.remove("sidebar-open");
}
function pageHead(title,sub,button=""){return `<div class="page-head"><div><h1>${title}</h1><p>${sub}</p></div>${button?`<div class="actions">${button}</div>`:""}</div>`}
function dashboardPage(){
 const total=data.students.length, collected=data.payments.reduce((a,p)=>a+Number(p.amount),0), expected=data.students.reduce((a,s)=>a+Number(s.fees||data.settings.defaultFees),0), balance=Math.max(0,expected-collected);
 return pageHead("Tableau de bord","Vue générale du Collège Le Pionnier",`<button class="primary" onclick="openModal('registrationModal')">+ Nouvelle inscription</button>`)
 +`<div class="cards">
 <div class="stat"><div class="label">Élèves</div><div class="value">${total}</div><div class="sub">Inscrits cette année</div></div>
 <div class="stat"><div class="label">Enseignants</div><div class="value">${data.teachers.length}</div><div class="sub">Personnel enregistré</div></div>
 <div class="stat"><div class="label">Paiements reçus</div><div class="value">${money(collected)}</div><div class="sub">Cumul enregistré</div></div>
 <div class="stat"><div class="label">Solde à recouvrer</div><div class="value">${money(balance)}</div><div class="sub">Selon les frais configurés</div></div></div>
 <div class="grid-2"><div class="panel"><div class="panel-head"><h2>Derniers paiements</h2><button class="secondary" onclick="showPage('payments')">Tout voir</button></div><div class="table-wrap">${paymentTable(data.payments.slice(-5).reverse())}</div></div>
 <div class="panel"><div class="panel-head"><h2>Dernières inscriptions</h2><button class="secondary" onclick="showPage('registrations')">Tout voir</button></div><div class="table-wrap">${registrationTable(data.registrations.slice(-5).reverse())}</div></div></div>
 <div class="panel"><div class="panel-head"><h2>Annonces</h2><button class="secondary" onclick="showPage('announcements')">Gérer</button></div>${data.announcements.slice(-3).reverse().map(a=>`<div class="announcement"><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div>`).join("")||'<div class="empty">Aucune annonce.</div>'}</div>`;
}
function studentsPage(){
 return pageHead("Élèves","Gestion des dossiers des élèves",`<button class="primary" onclick="editingStudent=null;clearStudentForm();openModal('studentModal')">+ Ajouter un élève</button>`)
 +`<div class="panel"><div class="panel-body"><div class="search-row"><input id="studentSearch" oninput="renderStudents()" placeholder="Rechercher par nom, classe ou ID..."></div><div id="studentsTable">${studentsTable()}</div></div></div>`;
}
function studentsTable(){
 const q=(document.getElementById("studentSearch")?.value||"").toLowerCase();
 const rows=data.students.filter(s=>(s.name+" "+s.class+" "+s.id).toLowerCase().includes(q));
 if(!rows.length)return '<div class="empty">Aucun élève trouvé.</div>';
 return `<div class="table-wrap"><table><thead><tr><th>ID</th><th>Élève</th><th>Classe</th><th>Responsable</th><th>Frais</th><th>Payé</th><th>Solde</th><th>Actions</th></tr></thead><tbody>${rows.map(s=>{let paid=paidFor(s.id);return `<tr><td>${s.id}</td><td><b>${esc(s.name)}</b><br><small class="muted">${s.sex||""}</small></td><td><span class="badge">${esc(s.class)}</span></td><td>${esc(s.parent)}<br><small class="muted">${esc(s.phone)}</small></td><td>${money(s.fees||data.settings.defaultFees)}</td><td>${money(paid)}</td><td><span class="badge ${paid>=(s.fees||data.settings.defaultFees)?"success":"warn"}">${money(Math.max(0,(s.fees||data.settings.defaultFees)-paid))}</span></td><td><button class="secondary" onclick="editStudent('${s.id}')">Modifier</button> <button class="danger" onclick="deleteStudent('${s.id}')">Suppr.</button></td></tr>`}).join("")}</tbody></table></div>`;
}
function renderStudents(){const x=document.getElementById("studentsTable");if(x)x.innerHTML=studentsTable()}
function teachersPage(){return pageHead("Enseignants","Personnel pédagogique du collège",`<button class="primary" onclick="addTeacher()">+ Ajouter</button>`)+`<div class="panel"><div class="table-wrap"><table><thead><tr><th>ID</th><th>Nom</th><th>Matière</th><th>Téléphone</th><th>Action</th></tr></thead><tbody>${data.teachers.map(t=>`<tr><td>${t.id}</td><td><b>${esc(t.name)}</b></td><td>${esc(t.subject)}</td><td>${esc(t.phone)}</td><td><button class="danger" onclick="deleteTeacher('${t.id}')">Suppr.</button></td></tr>`).join("")}</tbody></table></div></div>`}
function classesPage(){return pageHead("Classes","Effectifs par classe",`<button class="primary" onclick="addClass()">+ Nouvelle classe</button>`)+`<div class="cards">${data.classes.map(c=>{let n=data.students.filter(s=>s.class===c.name).length;return `<div class="stat"><div class="label">${esc(c.section)}</div><div class="value">${esc(c.name)}</div><div class="sub">${n} élève(s)</div></div>`}).join("")}</div>`}
function paymentsPage(){let total=data.payments.reduce((a,p)=>a+Number(p.amount),0);return pageHead("Frais & paiements","Suivi financier des élèves",`<button class="primary" onclick="preparePayment();openModal('paymentModal')">+ Enregistrer un paiement</button>`)+`<div class="cards"><div class="stat"><div class="label">Total encaissé</div><div class="value">${money(total)}</div></div><div class="stat"><div class="label">Transactions</div><div class="value">${data.payments.length}</div></div></div><div class="panel"><div class="table-wrap">${paymentTable([...data.payments].reverse(),true)}</div></div>`}
function paymentTable(rows,actions=false){if(!rows.length)return '<div class="empty">Aucun paiement.</div>';return `<table><thead><tr><th>Reçu</th><th>Élève</th><th>Montant</th><th>Date</th><th>Méthode</th><th>Référence</th>${actions?"<th>Action</th>":""}</tr></thead><tbody>${rows.map(p=>{let s=data.students.find(x=>x.id===p.studentId);return `<tr><td>${p.id}</td><td>${esc(s?.name||"Élève supprimé")}</td><td><b>${money(p.amount)}</b></td><td>${p.date}</td><td>${esc(p.method)}</td><td>${esc(p.ref||"—")}</td>${actions?`<td><button class="secondary" onclick="printReceipt('${p.id}')">Reçu</button></td>`:""}</tr>`}).join("")}</tbody></table>`}
function registrationsPage(){return pageHead("Inscriptions","Demandes et inscriptions des nouveaux élèves",`<button class="primary" onclick="openModal('registrationModal')">+ Nouvelle inscription</button>`)+`<div class="panel"><div class="table-wrap">${registrationTable([...data.registrations].reverse(),true)}</div></div>`}
function registrationTable(rows,actions=false){if(!rows.length)return '<div class="empty">Aucune inscription.</div>';return `<table><thead><tr><th>ID</th><th>Élève</th><th>Classe</th><th>Option</th><th>Date</th><th>Statut</th>${actions?"<th>Action</th>":""}</tr></thead><tbody>${rows.map(r=>`<tr><td>${r.id}</td><td>${esc(r.name)}</td><td>${esc(r.class)}</td><td>${esc(r.option)}</td><td>${r.date}</td><td><span class="badge ${r.status==="Validée"?"success":"warn"}">${r.status}</span></td>${actions?`<td><button class="secondary" onclick="validateRegistration('${r.id}')">${r.status==="Validée"?"Validée":"Valider"}</button></td>`:""}</tr>`).join("")}</tbody></table>`}
function gradesPage(){return pageHead("Notes & résultats","Suivi des moyennes des élèves")+`<div class="panel"><div class="table-wrap"><table><thead><tr><th>Élève</th><th>Classe</th><th>Période</th><th>Moyenne</th><th>Appréciation</th></tr></thead><tbody>${data.students.map(s=>{let g=data.grades.find(x=>x.studentId===s.id);let a=g?.average??"—";return `<tr><td>${esc(s.name)}</td><td>${s.class}</td><td>${g?.period||"—"}</td><td><b>${a}</b></td><td>${a==="—"?"—":a>=10?'<span class="badge success">Admis</span>':'<span class="badge danger">À suivre</span>'}</td></tr>`}).join("")}</tbody></table></div></div>`}
function announcementsPage(){return pageHead("Annonces","Informations destinées à la communauté scolaire",`<button class="primary" onclick="openModal('announcementModal')">+ Publier</button>`)+`<div class="panel">${[...data.announcements].reverse().map(a=>`<div class="announcement"><div class="kpi-row"><h3>${esc(a.title)}</h3><span class="muted">${a.date}</span></div><p>${esc(a.text)}</p><br><button class="danger" onclick="deleteAnnouncement('${a.id}')">Supprimer</button></div>`).join("")||'<div class="empty">Aucune annonce.</div>'}</div>`}
function publicPage(){return `<div class="public-hero"><h1>Collège Le Pionnier</h1><p>Former, expérimenter et préparer les élèves aux défis de demain. Bienvenue sur le portail officiel de gestion scolaire.</p><button class="primary" onclick="openModal('registrationModal')">S'inscrire en ligne</button></div><div class="grid-2"><div class="panel"><div class="panel-head"><h2>Nos niveaux</h2></div><div class="panel-body"><b>Maternelle</b><br><br><b>Primaire</b><br><br><b>Secondaire</b></div></div><div class="panel"><div class="panel-head"><h2>Nos options</h2></div><div class="panel-body option-grid">${["GÉO-MINE","Laboratoire chimique","Laboratoire électrique","Commercial et gestion","Humanité pédagogique","Mécanique générale"].map(o=>`<div class="option"><h3>${o}</h3><p class="muted">Découvrir et développer les compétences.</p></div>`).join("")}</div></div></div>`}

function paidFor(id){return data.payments.filter(p=>p.studentId===id).reduce((a,p)=>a+Number(p.amount),0)}
function populateSelect(id,items,placeholder){const el=document.getElementById(id);if(!el)return;el.innerHTML=`<option value="">${placeholder}</option>`+items.map(x=>`<option value="${esc(x.value??x)}">${esc(x.label??x)}</option>`).join("")}
function fillClassSelects(){const opts=data.classes.map(c=>c.name);populateSelect("sClass",opts,"Classe");populateSelect("rClass",opts,"Classe");}
function preparePayment(){populateSelect("pStudent",data.students.map(s=>({value:s.id,label:s.name+" — "+s.class})),"Élève");document.getElementById("pDate").value=today()}
function clearStudentForm(){["sName","sBirth","sParent","sPhone"].forEach(id=>document.getElementById(id).value="");document.getElementById("sSex").value="";fillClassSelects();document.getElementById("studentModalTitle").textContent="Ajouter un élève"}
function saveStudent(){const name=document.getElementById("sName").value.trim(),cl=document.getElementById("sClass").value;if(!name||!cl)return toast("Nom et classe obligatoires");let obj={name,birth:document.getElementById("sBirth").value,sex:document.getElementById("sSex").value,class:cl,parent:document.getElementById("sParent").value,phone:document.getElementById("sPhone").value,fees:data.settings.defaultFees};if(editingStudent){Object.assign(editingStudent,obj);toast("Élève modifié")}else{obj.id="ELV"+String(Date.now()).slice(-6);data.students.push(obj);toast("Élève ajouté")}save();closeModal("studentModal");showPage("students")}
function editStudent(id){editingStudent=data.students.find(s=>s.id===id);fillClassSelects();document.getElementById("sName").value=editingStudent.name;document.getElementById("sBirth").value=editingStudent.birth||"";document.getElementById("sSex").value=editingStudent.sex||"";document.getElementById("sClass").value=editingStudent.class;document.getElementById("sParent").value=editingStudent.parent||"";document.getElementById("sPhone").value=editingStudent.phone||"";document.getElementById("studentModalTitle").textContent="Modifier l'élève";openModal("studentModal")}
function deleteStudent(id){if(confirm("Supprimer cet élève ?")){data.students=data.students.filter(s=>s.id!==id);save();showPage("students");toast("Élève supprimé")}}
function savePayment(){let sid=document.getElementById("pStudent").value,amount=Number(document.getElementById("pAmount").value);if(!sid||amount<=0)return toast("Élève et montant obligatoires");data.payments.push({id:"REC"+String(Date.now()).slice(-6),studentId:sid,amount,date:document.getElementById("pDate").value||today(),method:document.getElementById("pMethod").value,ref:document.getElementById("pRef").value});save();closeModal("paymentModal");showPage("payments");toast("Paiement enregistré")}
function saveRegistration(){let name=document.getElementById("rName").value.trim(),cl=document.getElementById("rClass").value;if(!name||!cl)return toast("Nom et classe obligatoires");data.registrations.push({id:"INS"+String(Date.now()).slice(-6),name,class:cl,option:document.getElementById("rOption").value,date:today(),status:"En attente"});save();closeModal("registrationModal");showPage("registrations");toast("Inscription enregistrée")}
function validateRegistration(id){let r=data.registrations.find(x=>x.id===id);if(r){r.status="Validée";save();showPage("registrations");toast("Inscription validée")}}
function saveAnnouncement(){let title=document.getElementById("aTitle").value.trim(),text=document.getElementById("aText").value.trim();if(!title||!text)return toast("Titre et contenu obligatoires");data.announcements.push({id:"ANN"+String(Date.now()).slice(-6),title,text,date:today()});save();closeModal("announcementModal");showPage("announcements");toast("Annonce publiée")}
function deleteAnnouncement(id){data.announcements=data.announcements.filter(x=>x.id!==id);save();showPage("announcements");toast("Annonce supprimée")}
function addTeacher(){let name=prompt("Nom de l'enseignant");if(!name)return;let subject=prompt("Matière");data.teachers.push({id:"ENS"+String(Date.now()).slice(-6),name,subject:subject||"",phone:""});save();showPage("teachers");toast("Enseignant ajouté")}
function deleteTeacher(id){if(confirm("Supprimer cet enseignant ?")){data.teachers=data.teachers.filter(x=>x.id!==id);save();showPage("teachers")}}
function addClass(){let name=prompt("Nom de la classe");if(!name)return;data.classes.push({name,section:"Secondaire",students:0});save();showPage("classes");toast("Classe ajoutée")}
function printReceipt(id){let p=data.payments.find(x=>x.id===id),s=data.students.find(x=>x.id===p.studentId);let w=window.open("","_blank");w.document.write(`<html><head><title>Reçu ${p.id}</title><style>body{font-family:Arial;padding:40px;max-width:700px;margin:auto}h1{text-align:center;color:#123b70}.box{border:1px solid #ddd;padding:20px;margin:20px 0}footer{margin-top:50px;text-align:center}</style></head><body><h1>COLLÈGE LE PIONNIER</h1><h2>REÇU DE PAIEMENT</h2><div class="box"><p><b>N° :</b> ${p.id}</p><p><b>Élève :</b> ${esc(s?.name)}</p><p><b>Classe :</b> ${esc(s?.class)}</p><p><b>Montant :</b> ${money(p.amount)}</p><p><b>Date :</b> ${p.date}</p><p><b>Mode :</b> ${esc(p.method)}</p><p><b>Référence :</b> ${esc(p.ref||"—")}</p></div><footer>Merci pour votre confiance.</footer><script>window.print()<\/script></body></html>`);w.document.close()}
function openModal(id){if(id==="registrationModal")fillClassSelects();if(id==="studentModal")fillClassSelects();document.getElementById(id).classList.add("show")}
function closeModal(id){document.getElementById(id).classList.remove("show")}
function saveSettings(){data.settings.schoolName=document.getElementById("schoolName").value||"Collège Le Pionnier";data.settings.currency=document.getElementById("schoolCurrency").value||"FC";data.settings.defaultFees=Number(document.getElementById("defaultFees").value)||1200000;save();closeModal("settingsModal");toast("Paramètres sauvegardés");showPage("dashboard")}
function exportData(){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="college-le-pionnier-donnees.json";a.click();URL.revokeObjectURL(a.href);toast("Données exportées")}
function importData(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{data=JSON.parse(r.result);save();location.reload()}catch(err){toast("Fichier invalide")}};r.readAsText(f)}
document.addEventListener("click",e=>{if(e.target.classList.contains("modal"))e.target.classList.remove("show")});
window.addEventListener("beforeunload",save);

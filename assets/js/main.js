const toggle=document.querySelector(".menu-toggle");
const links=document.querySelector(".nav-links");
toggle?.addEventListener("click",()=>links.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));

const form=document.getElementById("contact-form");
form?.addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(form);
  const status=document.getElementById("form-status");
  status.textContent=`Merci ${data.get("nom")} ! Le formulaire est prêt à être relié à l'e-mail ou au WhatsApp officiel de l'école.`;
  form.reset();
});

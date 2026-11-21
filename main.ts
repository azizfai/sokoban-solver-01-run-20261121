import{readdirSync as R,readFileSync as F,writeFileSync as W,mkdirSync as M}from'node:fs';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
let D,SN,MK,ST,T,PV;
const parse=t=>{const r=t.trim().split('\n'),w=r[0].length,n=w*r.length,wall=new Uint8Array(n).fill(1),goals=[],boxes=[];let p=-1;D=[-w,w,-1,1];
const s=r.join('');
for(let i=0;i<n;i++){const c=s[i];wall[i]=c=='#';
if('.*+'.includes(c))goals.push(i);if('$*'.includes(c))boxes.push(i);if('@+'.includes(c))p=i;}
return{w,n,wall,goals,boxes:boxes.sort((a,b)=>a-b),player:p};};
const live=V=>{const{wall,goals,n}=V,lv=new Uint8Array(n),q=[...goals];
for(const g of goals)lv[g]=1;
for(let i=0;i<q.length;i++){const x=q[i];
for(let k=0;k<4;k++){const y=x-D[k];
if(!wall[y]&&!wall[y-D[k]]&&!lv[y]){lv[y]=1;q.push(y);}}}
return lv;};
const reach=(V,oc,f,S,P)=>{const{wall}=V;let lo=f,n=0;S[f]=++T;ST[n++]=f;
while(n){const p=ST[--n];if(p<lo)lo=p;
for(let k=0;k<4;k++){const q=p+D[k];if(!wall[q]&&!oc[q]&&S[q]!=T){S[q]=T;if(P)P[q]=p;ST[n++]=q;}}}
return lo;};
const walk=(from,to)=>{if(from==to)return'';let s='';
for(let p=to;p!=from;p=PV[p])s='udlr'[D.indexOf(p-PV[p])]+s;return s;};
const solve=V=>{const{w,wall,goals,n}=V,go=new Uint8Array(n);
for(const g of goals)go[g]=1;
const lv=live(V),oc=new Uint8Array(n);
SN=new Int32Array(n);MK=new Int32Array(n);ST=new Int32Array(n);PV=new Int32Array(n);T=0;
const K=a=>{let f=1,o=0;for(const x of[a,a+1,a+w,a+w+1]){f=f&&(wall[x]||oc[x]);o=o||oc[x]&&!go[x];}return f&&o;};
if(V.boxes.some(b=>!lv[b]))return null;
const Q=[[V.player,V.boxes,'']],seen=new Set([V.player+':'+V.boxes]);
for(let h=0;h<Q.length;h++){const[pl,bx,m]=Q[h];
if(bx.every(b=>go[b]))return[m,pl];
for(const b of bx)oc[b]=1;
reach(V,oc,pl,SN,PV);const he=T;
for(let bi=0;bi<bx.length;bi++){const b=bx[bi];
for(let k=0;k<4;k++){const d=D[k],t=b+d;
if(SN[b-d]!=he||wall[t]||oc[t]||!lv[t])continue;
oc[b]=0;oc[t]=1;const fr=K(t)||K(t-1)||K(t-w)||K(t-w-1);
let nx=null,ky='';
if(!fr){nx=bx.slice();nx[bi]=t;nx.sort((a,b)=>a-b);ky=reach(V,oc,b,MK,0)+':'+nx;}
oc[t]=0;oc[b]=1;
if(fr||seen.has(ky))continue;
if(Q.length>=250000)return null;
seen.add(ky);Q.push([b,nx,m+walk(pl,b-d)+'UDLR'[k]]);}}
for(const x of bx)oc[x]=0;}
return null;};
const rooms=V=>{const{w,wall,goals,boxes,player}=V,lv=live(V),row=player/w|0,pt=new Int32Array(V.n).fill(-1),rs=[];
for(let i=row*w;i<(row+1)*w;i++)if(!wall[i]&&!lv[i])pt[i]=-2;
if(boxes.some(b=>pt[b]==-2))return null;
for(let s=0;s<V.n;s++){if(wall[s]||pt[s]!=-1)continue;
const sq=[s];pt[s]=rs.length;
for(let i=0;i<sq.length;i++)for(let k=0;k<4;k++){const q=sq[i]+D[k];
if(!wall[q]&&pt[q]==-1){pt[q]=rs.length;sq.push(q);}}
rs.push({boxes:[],goals:[]});}
for(const b of boxes)rs[pt[b]].boxes.push(b);
for(const g of goals)if(pt[g]>=0)rs[pt[g]].goals.push(g);
if(goals.some(g=>pt[g]<0)||rs.some(r=>r.boxes.length!=r.goals.length))return null;
return rs.filter(r=>r.boxes.length);};
const solveLevel=V=>{let s;const rs=rooms(V);if(!rs)return(s=solve(V))?s[0]:null;
let pl=V.player,m='';
for(const r of rs){const wall=V.wall.slice();
for(const o of rs)if(o!==r)for(const b of o.done?o.goals:o.boxes)wall[b]=1;
if(!(s=solve({...V,wall,goals:r.goals,boxes:r.boxes,player:pl})))return null;m+=s[0];pl=s[1];r.done=1;}
return m;};
for(const id of R(I).sort()){let m='';
try{m=solveLevel(parse(F(`${I}/${id}/level.txt`,'utf8')))||'';}catch{}
M(`${O}/${id}`,{recursive:true});W(`${O}/${id}/solution.txt`,m);}

import React from 'react';
import { Globe, BookOpen, Languages, Sparkles } from 'lucide-react';
import { AfricanContentMetrics } from '../types/wikiindaba';

interface AfricanMetricsCardProps {
  metrics: AfricanContentMetrics;
  suggestions: string[];
}

export function AfricanMetricsCard({ metrics, suggestions }: AfricanMetricsCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800 p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-orange-500 dark:bg-orange-600 rounded-xl">
          <Globe className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            African Content Analysis
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            WikiIndaba Hackathon 2025 Special Metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* African Sources */}
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        }
div>
  );
    </ )}
iv>
        </d>
             </ul)}
       )         </li>
           n}</span>
 n>{suggestio<spa               
 pan>/s5">•<mt-0.e-500 ngt-orame="texNaasspan cl  <s         
     -300">xt-slate0 dark:telate-70xt-sext-sm te2 tce-x-ms-start spa"flex iteassName=cl{index} li key=      <
        index) => (suggestion, p((s.mauggestion   {s  ">
       ="space-y-2lassName       <ul ch4>
             </an Content
r Africfodations     Recommen
        >te mb-3"rk:text-whidat-slate-900 ibold texemfont-s"text-sm e=classNam     <h4      -xl p-4">
0/60 roundedlate-8060 dark:bg-s="bg-white/amesNiv clas      <d> 0 && (
  ions.length est    {sugg}
  */ns ioSuggest
      {/* /div>
iv>
      <        </d  </p>
es
        ectivedge & perspnous knowlIndige           >
 00 mt-1"ate-4ark:text-sle-600 d text-slat"text-xsme=  <p classNa>
           </div/>
                 }}
  Score}%` extalContlturtrics.cu`${meidth: ={{ w       style     e)}`}
  extScorContlturalcs.cu(metrigressColorroetPon-500 ${gratition-all dunsi-full trah-2 roundedclassName={`       div
               <">
    ed-full h-2oundlate-700 rk:bg-s dar00slate-2ll bg-"w-fulassName=  <div cv>
        </di       >
   </span       re}
     alContextScotrics.cultur  {me          )}`}>
  ContextScoreralltu(metrics.cuorreCol${getScold nt-boxt-2xl fosName={`te<span clas            >
</div      
           </span>         al Context
 Cultur          ">
     ate-300text-sle-700 dark:m text-slat-medium fonttext-sclassName="<span             " />
  400ge-xt-oranteark:00 dorange-6xt-h-5 w-5 teclassName="obe <Gl       
       2">er space-x-ems-cente="flex itssNamiv cla    <d
        -2">y-between mber justifentx items-c="flev className <di        
 p-4">unded-xl  ro0/60te-80g-sla0 dark:bbg-white/6me="ssNacla     <div */}
   text on* Cultural C        {/

</div>p>
              </   anguages
 African lrences in fe     Re>
       00"-4atetext-sle-600 dark:ext-slat="text-xs tsName    <p clas    v>
  </di
          an></sp         rences}
   RefeagealLangus.locic{metr            ite">
  dark:text-wht-slate-900 t-bold textext-2xl fon="n className    <spa    </div>
            >
    pan   </s           s
gecal Langua  Lo             e-300">
 latdark:text-st-slate-700 um texedit-sm font-me="texsNam  <span clas            />
 400"orange-text- dark:-orange-600w-5 textName="h-5 ages class<Langu           ">
   -x-2 spaces-centerlex itemlassName="f   <div c
         ">etween mb-2 justify-bcenterx items-flelassName=" <div c         
xl p-4">ded-00/60 rounte-8la-s0 dark:bgbg-white/6="lassName c  <div     
 } */Referencesge angua {/* Local L

           </div>  </p>
           
  contextAfricano  tceelevanic r        Top>
    "00 mt-1slate-4rk:text-600 datext-slate-xs me="text-ssNa  <p cla   /div>
           <>
     /        }}
    vance}%`opicRelenTfricametrics.a${dth: `le={{ wi  sty       e)}`}
     RelevancafricanTopicor(metrics.rogressColn-500 ${getPuratioion-all dansitl trnded-ful{`h-2 rou  className=        <div
      
          2"> h-ed-fulloundate-700 rark:bg-sl-slate-200 dull bgName="w-fv class       <diiv>
        </d      </span>
    }
       evanceanTopicRel.africmetrics    {
          evance)}`}>opicRelics.africanTreColor(metrold ${getScofont-bxl -2={`textlassName c     <span      
    </div>      >
   ansp  </    ce
        vancan Rele    Afri       
     ate-300">ext-slrk:t0 daext-slate-70t-medium t-sm fon"textassName=n cl   <spa        " />
   e-400t-orang600 dark:texext-orange--5 t"h-5 wclassName=les Spark      <">
        2space-x-enter items-came="flex lassN    <div c    b-2">
    -between mfyer justiitems-cent"flex Name=<div class    >
      4"xl p-0 rounded-ate-800/60 dark:bg-sl/6"bg-whiteassName=iv cl
        <devance */}ic Relop* T      {/
  iv>

        </d>     </pfound
     ources African surcesCount} fricanSometrics.a           {mt-1">
 e-400 slattext-e-600 dark:text-slatxs xt-"te=<p className
               </div>     
    />      }}
  age}%` ercentcanSourcesPetrics.afriidth: `${m={{ wstyle        }`}
      ntage)sPerceicanSourceetrics.afrressColor(metProg{gion-500 $ duratalln-transitiol ounded-ful-2 rame={`h      classN
              <div     
 "> h-2full700 rounded-g-slate-:be-200 darkbg-slatll "w-fusName=las      <div c  /div>
       <>
     /span        <}%
    centagePerSourcescan.afri   {metrics          }>
 centage)}`cesPerurnSorics.africaetColor(md ${getScorefont-bolxl ={`text-2sName<span clas            iv>
/d           <  </span>
          
   ources African S       
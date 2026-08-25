% resume.cls — modern single-column CV class, paired with the cover.cls
% cover-letter template (same Lato/Raleway fonts, same color language) so a
% CV and cover letter from this framework read as one visually branded set.
\ProvidesClass{resume}[2026/08/23 Modern resume class]
\NeedsTeXFormat{LaTeX2e}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax
\LoadClass[10.5pt]{article}

\usepackage[hmargin=2cm, top=1.5cm, bottom=1.6cm]{geometry}
\usepackage[hidelinks]{hyperref}
\usepackage[usenames,dvipsnames]{xcolor}
\usepackage{titlesec}
\usepackage{fontspec,xltxtra,xunicode}
\usepackage{fontawesome5}
\usepackage{enumitem}
\usepackage{ragged2e}
\usepackage{needspace}
\pagestyle{empty}
\setlength{\parindent}{0pt}
\AtBeginDocument{\raggedright}

% ---- Color language (shared with cover.cls) ----
\definecolor{date}{HTML}{6B6B6B}
\definecolor{primary}{HTML}{2B2B2B}
\definecolor{headings}{HTML}{1F3A5F}   % deep indigo-blue accent (replaces cover.cls's neutral gray for a stronger CV identity)
\definecolor{subheadings}{HTML}{333333}
\definecolor{rule}{HTML}{C7D1DC}

% ---- Fonts ----
\setmainfont[Color=primary, Path=fonts/lato/, BoldItalicFont=Lato-RegIta, BoldFont=Lato-Reg, ItalicFont=Lato-LigIta]{Lato-Lig}
\setsansfont[Scale=MatchLowercase, Mapping=tex-text, Path=fonts/raleway/]{Raleway-ExtraLight}

% ---- Header: name + tagline + contact row ----
\newcommand{\namesection}[3]{%
  \begin{center}
    {\fontsize{32pt}{36pt}\fontspec[Path=fonts/lato/]{Lato-Hai}\selectfont\color{headings} #1\ }%
    {\fontsize{32pt}{36pt}\fontspec[Path=fonts/lato/]{Lato-Lig}\selectfont\color{primary} #2}\\[2pt]
    {\color{subheadings}\fontspec[Path=fonts/raleway/]{Raleway-Medium}\fontsize{12pt}{15pt}\selectfont #3}
  \end{center}
}
\newcommand{\contactrow}[1]{%
  \begin{center}
    \color{date}\fontspec[Path=fonts/raleway/]{Raleway-Medium}\fontsize{9.5pt}{12pt}\selectfont #1
  \end{center}
  \vspace{2pt}
  {\color{rule}\hrule height 0.8pt}
  \vspace{10pt}
}

% ---- Section headings: colored small-caps + full-width rule ----
\titlespacing{\section}{0pt}{10pt}{6pt}
\titleformat{\section}{\color{headings}\fontspec[Path=fonts/lato/]{Lato-Bol}\fontsize{12.5pt}{15pt}\selectfont\raggedright}{}{0em}{}[{\vspace{2pt}\color{rule}\titlerule[0.8pt]}]
% Reserve room for the heading plus the start of its first entry, so a
% section title never lands alone at the bottom of a page with its content
% orphaned to the next.
\let\resume@oldsection\section
\renewcommand{\section}[1]{\needspace{7\baselineskip}\resume@oldsection{#1}}

% ---- Entry header: title/role on the left, date range right-aligned ----
\newcommand{\entryheader}[2]{%
  \needspace{4\baselineskip}%
  \noindent\begin{minipage}[t]{0.70\linewidth}\raggedright
    {\color{subheadings}\fontspec[Path=fonts/lato/]{Lato-Bol}\fontsize{11pt}{13pt}\selectfont #1}
  \end{minipage}\hfill%
  \begin{minipage}[t]{0.28\linewidth}\raggedleft
    {\color{date}\fontspec[Path=fonts/raleway/]{Raleway-Medium}\fontsize{9.5pt}{12pt}\selectfont #2}
  \end{minipage}\\[1pt]
}
\newcommand{\entrysub}[1]{%
  {\color{headings}\fontspec[Path=fonts/raleway/]{Raleway-Medium}\fontsize{10pt}{12pt}\selectfont #1}\\[3pt]
}

% ---- Skill category line: bold colored label + inline detail ----
\newcommand{\skillcat}[2]{%
  \noindent{\color{headings}\fontspec[Path=fonts/lato/]{Lato-Bol}\fontsize{10pt}{13pt}\selectfont #1: }%
  {\fontspec[Path=fonts/raleway/]{Raleway-Medium}\fontsize{10pt}{13pt}\selectfont #2}\\[4pt]
}

% ---- Tight bullet list ----
\newenvironment{tightemize}{%
  \begin{itemize}[leftmargin=14pt, itemsep=2pt, topsep=2pt, parsep=0pt]
  \fontspec[Path=fonts/raleway/, BoldFont=Raleway-Bold]{Raleway-Medium}\fontsize{10pt}{13pt}\selectfont
}{\end{itemize}}

\newcommand{\entryspace}{\vspace{8pt}}

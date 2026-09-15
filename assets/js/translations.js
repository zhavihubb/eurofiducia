/* EUROFIDUCIA — Multi-language Translation Engine
   Languages: EN, FR, IT, ES, DE, PT, AR, ZH, RU, HI
   Admin always sees English. Users see their selected native language.
*/
const LANGS = [
  {code:'en',name:'English',flag:'🇬🇧'},
  {code:'fr',name:'Français',flag:'🇫🇷'},
  {code:'it',name:'Italiano',flag:'🇮🇹'},
  {code:'es',name:'Español',flag:'🇪🇸'},
  {code:'de',name:'Deutsch',flag:'🇩🇪'},
  {code:'pt',name:'Português',flag:'🇵🇹'},
  {code:'ar',name:'العربية',flag:'🇸🇦'},
  {code:'zh',name:'中文',flag:'🇨🇳'},
  {code:'ru',name:'Русский',flag:'🇷🇺'},
  {code:'hi',name:'हिन्दी',flag:'🇮🇳'},
];

const I18N = {
  en:{
    // Nav
    nav_home:'Home',nav_markets:'Markets',nav_portfolios:'Portfolios',nav_about:'About',nav_legal:'Legal',
    nav_login:'Sign In',nav_register:'Create Account',nav_dashboard:'Dashboard',pf_title:'Regional Investment Portfolios',pf_subtitle:'Professionally managed portfolios tailored to French and Italian investors, plus Euro-zone and Global growth strategies. Choose your risk level and let our experts do the rest.',pending_title:'Your Account Is Under Review',pending_desc:'Thank you for registering! Your bank account details have been submitted and are being verified by our compliance team. You will receive an email confirmation once your account is approved. This typically takes 1-2 business days.',
    // Hero
    hero_title:'Invest Across Global Markets',hero_title_acc1:'Build a diversified portfolio',hero_title_acc2:'across equities, ETFs, bonds, real estate and more.',
    hero_sub:'Access European and global investment opportunities with a regulated, transparent platform built for French and Italian investors.',
    hero_cta1:'Create Account',hero_cta2:'Explore Investments',
    hero_stat1:'€2.4B+ Assets',hero_stat2:'50,000+ Investors',hero_stat3:'12 Asset Classes',hero_stat4:'FR · IT · EU · Global',
    // Sections
    sec_cat_eyebrow:'Investment Marketplace',sec_cat_title:'Everything You Need to Build Wealth',sec_cat_sub:'From European equities to global cryptoassets — all in one regulated platform.',
    // Categories
    cat_stocks:'Stocks',cat_stocks_d:'CAC 40, FTSE MIB, European & global companies',
    cat_etfs:'ETFs & Funds',cat_etfs_d:'S&P 500, MSCI World, Euro Stoxx 50, sector funds',
    cat_bonds:'Fixed Income',cat_bonds_d:'French & Italian government bonds, corporate bonds',
    cat_realestate:'Real Estate',cat_realestate_d:'Property funds, SCPI, REIT-style exposure',
    cat_sustainable:'Sustainable / ESG',cat_sustainable_d:'Green bonds, renewable energy funds',
    cat_private:'Private Markets',cat_private_d:'Private equity, venture capital, infrastructure',
    cat_commodities:'Commodities',cat_commodities_d:'Gold, energy, agricultural commodities',
    cat_crypto:'Cryptoassets',cat_crypto_d:'Bitcoin, Ethereum and eligible cryptoassets',
    cat_retirement:'Retirement',cat_retirement_d:'PER, pension schemes, long-term savings',
    cat_cash:'Cash & Savings',cat_cash_d:'Livret A, LDDS, regulated savings products',
    // Risk
    risk_low:'Low Risk',risk_med:'Medium Risk',risk_high:'High Risk',
    risk_conservative:'Conservative',risk_balanced:'Balanced',risk_growth:'Growth',
    // Regions
    reg_fr:'France Portfolio',reg_it:'Italy Portfolio',reg_eu:'Euro Growth',reg_global:'Global Growth',
    reg_fr_d:'European equities, bonds & PEA-eligible products',reg_it_d:'BTPs, Italian equities & PIR investments',
    reg_eu_d:'Diversified European ETFs across sectors',reg_global_d:'Global equities, ETFs & alternatives',
    sec_region_eyebrow:'Regional Portfolios',sec_region_title:'Choose Your Strategy',sec_region_sub:'Model portfolios tailored to your risk profile and region.',
    // Auth
    auth_welcome:'Welcome to EuroFiducia',auth_welcome_sub:'Your trusted European investment platform. Join thousands of investors building diversified portfolios across global markets.',
    auth_have_account:'Already have an account?',auth_no_account:"Don't have an account?",
    // Register
    reg_title:'Create Your Account',reg_sub:'Start investing in minutes',reg_step1:'Account',reg_step2:'Identity',reg_step3:'Profile',reg_step4:'Compliance',
    lbl_firstname:'First Name',lbl_lastname:'Last Name',lbl_email:'Email Address',lbl_phone:'Phone Number',lbl_password:'Password',lbl_country:'Country of Residence',
    lbl_confirm_password:'Confirm Password',
    // Dashboard
    dash_overview:'Overview',dash_portfolio:'Portfolio',dash_invest:'Investments',dash_deposit:'Deposit',dash_withdraw:'Withdraw',dash_transactions:'Transactions',dash_messages:'Messages',dash_support:'Support',dash_settings:'Settings',
    dash_welcome:'Welcome back',dash_portfolio_value:'Total Portfolio Value',dash_available:'Available Cash',dash_invested:'Invested Amount',dash_pl:'Profit / Loss',
    // Deposit
    dep_title:'Deposit Funds',dep_available:'Available to deposit',dep_method:'Payment Method',dep_sepa:'SEPA Bank Transfer',dep_card:'Card Payment',dep_openbanking:'Open Banking',
    dep_amount:'Amount (EUR)',dep_confirm:'Confirm Deposit',
    // Withdraw
    wd_title:'Withdraw Funds',wd_available:'Available to withdraw',wd_amount:'Amount',wd_bank:'Bank Account',wd_confirm:'Request Withdrawal',
    // Admin
    admin_overview:'Dashboard Overview',admin_users:'Users',admin_transactions:'Transactions',admin_generate:'Generate Transactions',admin_messages:'Messaging',admin_support:'Support Inbox',admin_compliance:'Compliance',admin_reports:'Reports',admin_products:'Investments',admin_settings:'Settings',
    // Footer
    footer_company:'Company',footer_legal:'Legal',footer_support:'Support',footer_disclaimer:'Capital at risk. The value of investments can go down as well as up. Past performance is not indicative of future results. This platform is for demonstration purposes.',
    // Support
    support_title:'Customer Support',support_online:'Online — AI Assistant',support_greeting:'Hello! Welcome to EuroFiducia Support. How can I help you today?',
    support_q1:'How do I deposit funds?',support_q2:'How do I withdraw?',support_q3:'What investments are available?',support_q4:'How do I reset my password?',
    support_escalating:'I am connecting you with a human agent. Please hold on a moment.',
    // Misc
    btn_continue:'Continue',btn_back:'Back',btn_submit:'Submit',btn_cancel:'Cancel',btn_save:'Save',btn_send:'Send',btn_close:'Close',btn_view:'View',btn_download:'Download',
    msg_sent:'Message sent successfully',msg_saved:'Saved successfully',
  },
  fr:{
    nav_home:'Accueil',nav_markets:'Marchés',nav_portfolios:'Portefeuilles',nav_about:'À propos',nav_legal:'Légal',
    nav_login:'Connexion',nav_register:'Créer un compte',nav_dashboard:'Tableau de bord',pf_title:'Portefeuilles d\'investissement régionaux',pf_subtitle:'Portefeuilles gérés professionnellement, adaptés aux investisseurs français et italiens, plus des stratégies de croissance Euro et Mondiale. Choisissez votre niveau de risque.',pending_title:'Votre compte est en cours de revue',pending_desc:'Merci de votre inscription! Les coordonnées de votre compte bancaire ont été soumises et sont vérifiées par notre équipe de conformité. Vous recevrez un e-mail de confirmation dès que votre compte sera approuvé. Cela prend généralement 1 à 2 jours ouvrables.',
    hero_title:'Investissez sur les marchés mondiaux',hero_title_acc1:'Construisez un portefeuille diversifié',hero_title_acc2:'à travers actions, ETF, obligations et plus.',
    hero_sub:'Accédez aux opportunités d\'investissement européennes et mondiales avec une plateforme réglementée et transparente, conçue pour les investisseurs français et italiens.',
    hero_cta1:'Créer un compte',hero_cta2:'Explorer les investissements',
    hero_stat1:'2,4 Mds+ d\'actifs',hero_stat2:'50 000+ investisseurs',hero_stat3:'12 classes d\'actifs',hero_stat4:'FR · IT · UE · Monde',
    sec_cat_eyebrow:'Marché d\'investissement',sec_cat_title:'Tout pour construire votre patrimoine',sec_cat_sub:'Des actions européennes aux cryptomonnaies — tout sur une plateforme réglementée.',
    cat_stocks:'Actions',cat_stocks_d:'CAC 40, FTSE MIB, sociétés européennes et mondiales',
    cat_etfs:'ETF et Fonds',cat_etfs_d:'S&P 500, MSCI World, Euro Stoxx 50, fonds sectoriels',
    cat_bonds:'Obligations',cat_bonds_d:'Obligations d\'État françaises et italiennes, obligations d\'entreprises',
    cat_realestate:'Immobilier',cat_realestate_d:'Fonds immobiliers, SCPI, exposition de type REIT',
    cat_sustainable:'Durable / ESG',cat_sustainable_d:'Obligations vertes, fonds d\'énergies renouvelables',
    cat_private:'Marchés privés',cat_private_d:'Private equity, capital-risque, infrastructure',
    cat_commodities:'Matières premières',cat_commodities_d:'Or, énergie, matières agricoles',
    cat_crypto:'Cryptoactifs',cat_crypto_d:'Bitcoin, Ethereum et cryptoactifs éligibles',
    cat_retirement:'Retraite',cat_retirement_d:'PER, régimes de retraite, épargne long terme',
    cat_cash:'Liquidités et épargne',cat_cash_d:'Livret A, LDDS, produits d\'épargne réglementée',
    risk_low:'Risque faible',risk_med:'Risque moyen',risk_high:'Risque élevé',
    risk_conservative:'Prudent',risk_balanced:'Équilibré',risk_growth:'Dynamique',
    reg_fr:'Portefeuille France',reg_it:'Portefeuille Italie',reg_eu:'Croissance Euro',reg_global:'Croissance Mondiale',
    reg_fr_d:'Actions européennes, obligations et produits éligibles PEA',reg_it_d:'BTP, actions italiennes et investissements PIR',
    reg_eu_d:'ETF européens diversifiés par secteur',reg_global_d:'Actions mondiales, ETF et alternatives',
    sec_region_eyebrow:'Portefeuilles régionaux',sec_region_title:'Choisissez votre stratégie',sec_region_sub:'Portefeuilles modèles adaptés à votre profil de risque et votre région.',
    auth_welcome:'Bienvenue sur EuroFiducia',auth_welcome_sub:'Votre plateforme d\'investissement européenne de confiance. Rejoignez des milliers d\'investisseurs.',
    auth_have_account:'Vous avez déjà un compte ?',auth_no_account:'Pas encore de compte ?',
    reg_title:'Créez votre compte',reg_sub:'Commencez à investir en quelques minutes',reg_step1:'Compte',reg_step2:'Identité',reg_step3:'Profil',reg_step4:'Conformité',
    lbl_firstname:'Prénom',lbl_lastname:'Nom',lbl_email:'Adresse e-mail',lbl_phone:'Téléphone',lbl_password:'Mot de passe',lbl_country:'Pays de résidence',lbl_confirm_password:'Confirmer le mot de passe',
    dash_overview:'Aperçu',dash_portfolio:'Portefeuille',dash_invest:'Investissements',dash_deposit:'Dépôt',dash_withdraw:'Retrait',dash_transactions:'Transactions',dash_messages:'Messages',dash_support:'Assistance',dash_settings:'Paramètres',
    dash_welcome:'Bon retour',dash_portfolio_value:'Valeur totale du portefeuille',dash_available:'Liquidités disponibles',dash_invested:'Montant investi',dash_pl:'Plus/moins-value',
    dep_title:'Déposer des fonds',dep_available:'Disponible à déposer',dep_method:'Méthode de paiement',dep_sepa:'Virement SEPA',dep_card:'Carte bancaire',dep_openbanking:'Banque ouverte',dep_amount:'Montant (EUR)',dep_confirm:'Confirmer le dépôt',
    wd_title:'Retirer des fonds',wd_available:'Disponible à retirer',wd_amount:'Montant',wd_bank:'Compte bancaire',wd_confirm:'Demander un retrait',
    admin_overview:'Tableau de bord',admin_users:'Utilisateurs',admin_transactions:'Transactions',admin_generate:'Générer des transactions',admin_messages:'Messagerie',admin_support:'Assistance',admin_compliance:'Conformité',admin_reports:'Rapports',admin_products:'Investissements',admin_settings:'Paramètres',
    footer_company:'Société',footer_legal:'Légal',footer_support:'Assistance',footer_disclaimer:'Risque en capital. La valeur des investissements peut baisser comme monter. Plateforme de démonstration.',
    support_title:'Assistance client',support_online:'En ligne — Assistant IA',support_greeting:'Bonjour ! Bienvenue sur l\'assistance EuroFiducia. Comment puis-je vous aider ?',
    support_q1:'Comment déposer des fonds ?',support_q2:'Comment retirer ?',support_q3:'Quels investissements sont disponibles ?',support_q4:'Comment réinitialiser mon mot de passe ?',
    support_escalating:'Je vous mets en relation avec un conseiller. Veuillez patienter.',
    btn_continue:'Continuer',btn_back:'Retour',btn_submit:'Soumettre',btn_cancel:'Annuler',btn_save:'Enregistrer',btn_send:'Envoyer',btn_close:'Fermer',btn_view:'Voir',btn_download:'Télécharger',
    msg_sent:'Message envoyé avec succès',msg_saved:'Enregistré avec succès',
  },
  it:{
    nav_home:'Home',nav_markets:'Mercati',nav_portfolios:'Portafogli',nav_about:'Chi siamo',nav_legal:'Legale',
    nav_login:'Accedi',nav_register:'Crea account',nav_dashboard:'Dashboard',pf_title:'Portafogli di investimento regionali',pf_subtitle:'Portafogli gestiti professionalmente per investitori francesi e italiani, più strategie di crescita Euro e Globale. Scegli il tuo livello di rischio.',pending_title:'Il tuo account è in revisione',pending_desc:'Grazie per esserti registrato! I dettagli del tuo conto bancario sono stati inviati e sono in fase di verifica da parte del nostro team di conformità. Riceverai un\'email di conferma una volta che il tuo account sarà approvato. Questo richiede generalmente 1-2 giorni lavorativi.',
    hero_title:'Investi nei mercati globali',hero_title_acc1:'Costruisci un portafoglio diversificato',hero_title_acc2:'tra azioni, ETF, obbligazioni e altro.',
    hero_sub:'Accedi a opportunità di investimento europee e globali con una piattaforma regolamentata e trasparente, pensata per investitori francesi e italiani.',
    hero_cta1:'Crea account',hero_cta2:'Esplora investimenti',
    hero_stat1:'2,4 Mld+ di asset',hero_stat2:'50.000+ investitori',hero_stat3:'12 classi di asset',hero_stat4:'FR · IT · UE · Mondo',
    sec_cat_eyebrow:'Mercato degli investimenti',sec_cat_title:'Tutto per costruire il tuo patrimonio',sec_cat_sub:'Dalle azioni europee alle criptovalute — tutto in una piattaforma regolamentata.',
    cat_stocks:'Azioni',cat_stocks_d:'CAC 40, FTSE MIB, società europee e globali',
    cat_etfs:'ETF e Fondi',cat_etfs_d:'S&P 500, MSCI World, Euro Stoxx 50, fondi settoriali',
    cat_bonds:'Obbligazioni',cat_bonds_d:'BTP italiani, obbligazioni statali e corporate',
    cat_realestate:'Immobiliare',cat_realestate_d:'Fondi immobiliari, SCPI, esposizione tipo REIT',
    cat_sustainable:'Sostenibile / ESG',cat_sustainable_d:'Green bond, fondi rinnovabili',
    cat_private:'Mercati privati',cat_private_d:'Private equity, venture capital, infrastrutture',
    cat_commodities:'Materie prime',cat_commodities_d:'Oro, energia, materie agricole',
    cat_crypto:'Criptoasset',cat_crypto_d:'Bitcoin, Ethereum e criptoasset idonei',
    cat_retirement:'Pensione',cat_retirement_d:'PER, schemi pensionistici, risparmio lungo termine',
    cat_cash:'Contanti e risparmio',cat_cash_d:'Libretti di risparmio regolamentati',
    risk_low:'Rischio basso',risk_med:'Rischio medio',risk_high:'Rischio elevato',
    risk_conservative:'Conservativo',risk_balanced:'Bilanciato',risk_growth:'Crescita',
    reg_fr:'Portafoglio Francia',reg_it:'Portafoglio Italia',reg_eu:'Crescita Euro',reg_global:'Crescita Globale',
    reg_fr_d:'Azioni europee, obbligazioni e prodotti PEA',reg_it_d:'BTP, azioni italiane e investimenti PIR',
    reg_eu_d:'ETF europei diversificati per settore',reg_global_d:'Azioni globali, ETF e alternative',
    sec_region_eyebrow:'Portafogli regionali',sec_region_title:'Scegli la tua strategia',sec_region_sub:'Portafogli modello adatti al tuo profilo di rischio e regione.',
    auth_welcome:'Benvenuto su EuroFiducia',auth_welcome_sub:'La tua piattaforma europea di investimento. Unisciti a migliaia di investitori.',
    auth_have_account:'Hai già un account?',auth_no_account:'Non hai un account?',
    reg_title:'Crea il tuo account',reg_sub:'Inizia a investire in pochi minuti',reg_step1:'Account',reg_step2:'Identità',reg_step3:'Profilo',reg_step4:'Conformità',
    lbl_firstname:'Nome',lbl_lastname:'Cognome',lbl_email:'Email',lbl_phone:'Telefono',lbl_password:'Password',lbl_country:'Paese di residenza',lbl_confirm_password:'Conferma password',
    dash_overview:'Panoramica',dash_portfolio:'Portafoglio',dash_invest:'Investimenti',dash_deposit:'Deposito',dash_withdraw:'Prelievo',dash_transactions:'Transazioni',dash_messages:'Messaggi',dash_support:'Assistenza',dash_settings:'Impostazioni',
    dash_welcome:'Bentornato',dash_portfolio_value:'Valore totale portafoglio',dash_available:'Contanti disponibili',dash_invested:'Importo investito',dash_pl:'Profitto/Perdita',
    dep_title:'Deposita fondi',dep_available:'Disponibile al deposito',dep_method:'Metodo di pagamento',dep_sepa:'Bonifico SEPA',dep_card:'Carta',dep_openbanking:'Open Banking',dep_amount:'Importo (EUR)',dep_confirm:'Conferma deposito',
    wd_title:'Preleva fondi',wd_available:'Disponibile al prelievo',wd_amount:'Importo',wd_bank:'Conto bancario',wd_confirm:'Richiedi prelievo',
    admin_overview:'Dashboard',admin_users:'Utenti',admin_transactions:'Transazioni',admin_generate:'Genera transazioni',admin_messages:'Messaggistica',admin_support:'Assistenza',admin_compliance:'Conformità',admin_reports:'Report',admin_products:'Investimenti',admin_settings:'Impostazioni',
    footer_company:'Società',footer_legal:'Legale',footer_support:'Assistenza',footer_disclaimer:'Capitale a rischio. Il valore degli investimenti può scendere o salire. Piattaforma dimostrativa.',
    support_title:'Assistenza clienti',support_online:'Online — Assistente IA',support_greeting:'Ciao! Benvenuto sull\'assistenza EuroFiducia. Come posso aiutarti?',
    support_q1:'Come deposito fondi?',support_q2:'Come prelevo?',support_q3:'Quali investimenti sono disponibili?',support_q4:'Come reimposto la password?',
    support_escalating:'Ti sto mettendo in contatto con un operatore. Attendi.',
    btn_continue:'Continua',btn_back:'Indietro',btn_submit:'Invia',btn_cancel:'Annulla',btn_save:'Salva',btn_send:'Invia',btn_close:'Chiudi',btn_view:'Vedi',btn_download:'Scarica',
    msg_sent:'Messaggio inviato con successo',msg_saved:'Salvato con successo',
  },
  es:{
    nav_home:'Inicio',nav_markets:'Mercados',nav_portfolios:'Carteras',nav_about:'Acerca de',nav_legal:'Legal',
    nav_login:'Iniciar sesión',nav_register:'Crear cuenta',nav_dashboard:'Panel',pf_title:'Portafolios de inversión regionales',pf_subtitle:'Portafolios gestionados profesionalmente para inversores franceses e italianos, más estrategias de crecimiento Euro y Global.',pending_title:'Su cuenta está en revisión',pending_desc:'Gracias por registrarse. Los datos de su cuenta bancaria han sido enviados y están siendo verificados por nuestro equipo de cumplimiento. Recibirá un correo de confirmación cuando su cuenta sea aprobada. Esto suele tardar 1-2 días hábiles.',
    hero_title:'Invierte en mercados globales',hero_title_acc1:'Construye una cartera diversificada',hero_title_acc2:'en acciones, ETF, bonos y más.',
    hero_sub:'Accede a oportunidades de inversión europeas y globales con una plataforma regulada y transparente.',
    hero_cta1:'Crear cuenta',hero_cta2:'Explorar inversiones',
    hero_stat1:'2.400M+ en activos',hero_stat2:'50.000+ inversores',hero_stat3:'12 clases de activos',hero_stat4:'FR · IT · UE · Global',
    sec_cat_eyebrow:'Mercado de inversión',sec_cat_title:'Todo para construir tu patrimonio',sec_cat_sub:'De acciones europeas a criptomonedas — todo en una plataforma regulada.',
    cat_stocks:'Acciones',cat_stocks_d:'CAC 40, FTSE MIB, empresas europeas y globales',
    cat_etfs:'ETF y Fondos',cat_etfs_d:'S&P 500, MSCI World, Euro Stoxx 50',
    cat_bonds:'Renta Fija',cat_bonds_d:'Bonos gubernamentales y corporativos',
    cat_realestate:'Inmobiliario',cat_realestate_d:'Fondos inmobiliarios, exposición tipo REIT',
    cat_sustainable:'Sostenible / ESG',cat_sustainable_d:'Green bonds, fondos renovables',
    cat_private:'Mercados privados',cat_private_d:'Private equity, venture capital',
    cat_commodities:'Materias primas',cat_commodities_d:'Oro, energía, agrícolas',
    cat_crypto:'Criptoactivos',cat_crypto_d:'Bitcoin, Ethereum y criptoactivos',
    cat_retirement:'Jubilación',cat_retirement_d:'Planes de jubilación, ahorro largo plazo',
    cat_cash:'Efectivo y ahorro',cat_cash_d:'Productos de ahorro regulados',
    risk_low:'Riesgo bajo',risk_med:'Riesgo medio',risk_high:'Riesgo alto',
    risk_conservative:'Conservador',risk_balanced:'Equilibrado',risk_growth:'Crecimiento',
    reg_fr:'Cartera Francia',reg_it:'Cartera Italia',reg_eu:'Crecimiento Euro',reg_global:'Crecimiento Global',
    reg_fr_d:'Acciones europeas, bonos y productos PEA',reg_it_d:'BTP, acciones italianas e inversiones PIR',reg_eu_d:'ETF europeos diversificados',reg_global_d:'Acciones globales, ETF y alternativas',
    sec_region_eyebrow:'Carteras regionales',sec_region_title:'Elige tu estrategia',sec_region_sub:'Carteras modelo adaptadas a tu perfil de riesgo.',
    auth_welcome:'Bienvenido a EuroFiducia',auth_welcome_sub:'Tu plataforma europea de inversión de confianza.',
    auth_have_account:'¿Ya tienes cuenta?',auth_no_account:'¿No tienes cuenta?',
    reg_title:'Crea tu cuenta',reg_sub:'Empieza a invertir en minutos',reg_step1:'Cuenta',reg_step2:'Identidad',reg_step3:'Perfil',reg_step4:'Cumplimiento',
    lbl_firstname:'Nombre',lbl_lastname:'Apellido',lbl_email:'Email',lbl_phone:'Teléfono',lbl_password:'Contraseña',lbl_country:'País de residencia',lbl_confirm_password:'Confirmar contraseña',
    dash_overview:'Resumen',dash_portfolio:'Cartera',dash_invest:'Inversiones',dash_deposit:'Depositar',dash_withdraw:'Retirar',dash_transactions:'Transacciones',dash_messages:'Mensajes',dash_support:'Soporte',dash_settings:'Ajustes',
    dash_welcome:'Bienvenido de nuevo',dash_portfolio_value:'Valor total de cartera',dash_available:'Efectivo disponible',dash_invested:'Importe invertido',dash_pl:'Ganancia/Pérdida',
    dep_title:'Depositar fondos',dep_available:'Disponible para depositar',dep_method:'Método de pago',dep_sepa:'Transferencia SEPA',dep_card:'Tarjeta',dep_openbanking:'Open Banking',dep_amount:'Importe (EUR)',dep_confirm:'Confirmar depósito',
    wd_title:'Retirar fondos',wd_available:'Disponible para retirar',wd_amount:'Importe',wd_bank:'Cuenta bancaria',wd_confirm:'Solicitar retiro',
    admin_overview:'Panel',admin_users:'Usuarios',admin_transactions:'Transacciones',admin_generate:'Generar transacciones',admin_messages:'Mensajería',admin_support:'Soporte',admin_compliance:'Cumplimiento',admin_reports:'Informes',admin_products:'Inversiones',admin_settings:'Ajustes',
    footer_company:'Empresa',footer_legal:'Legal',footer_support:'Soporte',footer_disclaimer:'Capital en riesgo. Plataforma de demostración.',
    support_title:'Soporte al cliente',support_online:'En línea — Asistente IA',support_greeting:'¡Hola! Bienvenido al soporte EuroFiducia. ¿Cómo puedo ayudarte?',
    support_q1:'¿Cómo deposito fondos?',support_q2:'¿Cómo retiro?',support_q3:'¿Qué inversiones hay?',support_q4:'¿Cómo restablezco mi contraseña?',
    support_escalating:'Te estoy conectando con un agente. Espera un momento.',
    btn_continue:'Continuar',btn_back:'Atrás',btn_submit:'Enviar',btn_cancel:'Cancelar',btn_save:'Guardar',btn_send:'Enviar',btn_close:'Cerrar',btn_view:'Ver',btn_download:'Descargar',
    msg_sent:'Mensaje enviado con éxito',msg_saved:'Guardado con éxito',
  },
  de:{
    nav_home:'Startseite',nav_markets:'Märkte',nav_portfolios:'Portfolios',nav_about:'Über uns',nav_legal:'Rechtliches',
    nav_login:'Anmelden',nav_register:'Konto erstellen',nav_dashboard:'Dashboard',pf_title:'Regionale Anlageportfolios',pf_subtitle:'Professionell verwaltete Portfolios für französische und italienische Anleger, plus Euro- und globale Wachstumsstrategien.',pending_title:'Ihr Konto wird geprüft',pending_desc:'Vielen Dank für Ihre Registrierung! Ihre Bankkontodaten wurden eingereicht und werden von unserem Compliance-Team geprüft. Sie erhalten eine E-Mail-Bestätigung, sobald Ihr Konto freigeschaltet ist. Dies dauert in der Regel 1-2 Werktage.',
    hero_title:'Investieren Sie weltweit',hero_title_acc1:'Diversifiziertes Portfolio aufbauen',hero_title_acc2:'mit Aktien, ETFs, Anleihen und mehr.',
    hero_sub:'Zugang zu europäischen und globalen Anlagemöglichkeiten über eine regulierte, transparente Plattform.',
    hero_cta1:'Konto erstellen',hero_cta2:'Anlagen erkunden',
    hero_stat1:'2,4 Mrd.+ Vermögenswerte',hero_stat2:'50.000+ Anleger',hero_stat3:'12 Anlageklassen',hero_stat4:'FR · IT · EU · Global',
    sec_cat_eyebrow:'Anlagemarkt',sec_cat_title:'Alles für Ihren Vermögensaufbau',sec_cat_sub:'Von europäischen Aktien bis Krypto — alles auf einer Plattform.',
    cat_stocks:'Aktien',cat_stocks_d:'CAC 40, FTSE MIB, europäische und globale Unternehmen',
    cat_etfs:'ETFs und Fonds',cat_etfs_d:'S&P 500, MSCI World, Euro Stoxx 50',
    cat_bonds:'Festverzinslich',cat_bonds_d:'Staats- und Unternehmensanleihen',
    cat_realestate:'Immobilien',cat_realestate_d:'Immobilienfonds, REIT-Exposition',
    cat_sustainable:'Nachhaltig / ESG',cat_sustainable_d:'Grüne Anleihen, erneuerbare Fonds',
    cat_private:'Private Märkte',cat_private_d:'Private Equity, Venture Capital',
    cat_commodities:'Rohstoffe',cat_commodities_d:'Gold, Energie, Agrar',
    cat_crypto:'Kryptoassets',cat_crypto_d:'Bitcoin, Ethereum und mehr',
    cat_retirement:'Rente',cat_retirement_d:'Altersvorsorge, langfristiges Sparen',
    cat_cash:'Bargeld und Sparen',cat_cash_d:'Regulierte Sparkonten',
    risk_low:'Niedriges Risiko',risk_med:'Mittleres Risiko',risk_high:'Hohes Risiko',
    risk_conservative:'Konservativ',risk_balanced:'Ausgeglichen',risk_growth:'Wachstum',
    reg_fr:'Portfolio Frankreich',reg_it:'Portfolio Italien',reg_eu:'Euro Wachstum',reg_global:'Global Wachstum',
    reg_fr_d:'Europäische Aktien, Anleihen und PEA-Produkte',reg_it_d:'BTP, italienische Aktien und PIR',reg_eu_d:'Diversifizierte europäische ETFs',reg_global_d:'Globale Aktien, ETFs und Alternativen',
    sec_region_eyebrow:'Regionale Portfolios',sec_region_title:'Wählen Sie Ihre Strategie',sec_region_sub:'Modellportfolios für Ihr Risikoprofil.',
    auth_welcome:'Willkommen bei EuroFiducia',auth_welcome_sub:'Ihre vertrauenswürdige europäische Anlageplattform.',
    auth_have_account:'Schon ein Konto?',auth_no_account:'Noch kein Konto?',
    reg_title:'Konto erstellen',reg_sub:'In Minuten investieren',reg_step1:'Konto',reg_step2:'Identität',reg_step3:'Profil',reg_step4:'Compliance',
    lbl_firstname:'Vorname',lbl_lastname:'Nachname',lbl_email:'E-Mail',lbl_phone:'Telefon',lbl_password:'Passwort',lbl_country:'Wohnsitzland',lbl_confirm_password:'Passwort bestätigen',
    dash_overview:'Übersicht',dash_portfolio:'Portfolio',dash_invest:'Anlagen',dash_deposit:'Einzahlen',dash_withdraw:'Auszahlen',dash_transactions:'Transaktionen',dash_messages:'Nachrichten',dash_support:'Support',dash_settings:'Einstellungen',
    dash_welcome:'Willkommen zurück',dash_portfolio_value:'Gesamtwert Portfolio',dash_available:'Verfügbares Bargeld',dash_invested:'Investierter Betrag',dash_pl:'Gewinn/Verlust',
    dep_title:'Gelder einzahlen',dep_available:'Verfügbar zum Einzahlen',dep_method:'Zahlungsmethode',dep_sepa:'SEPA-Überweisung',dep_card:'Karte',dep_openbanking:'Open Banking',dep_amount:'Betrag (EUR)',dep_confirm:'Einzahlung bestätigen',
    wd_title:'Gelder auszahlen',wd_available:'Verfügbar zum Auszahlen',wd_amount:'Betrag',wd_bank:'Bankkonto',wd_confirm:'Auszahlung anfordern',
    admin_overview:'Dashboard',admin_users:'Nutzer',admin_transactions:'Transaktionen',admin_generate:'Transaktionen generieren',admin_messages:'Nachrichten',admin_support:'Support',admin_compliance:'Compliance',admin_reports:'Berichte',admin_products:'Anlagen',admin_settings:'Einstellungen',
    footer_company:'Unternehmen',footer_legal:'Rechtliches',footer_support:'Support',footer_disclaimer:'Kapitalriskiko. Demo-Plattform.',
    support_title:'Kundenservice',support_online:'Online — KI-Assistent',support_greeting:'Hallo! Willkommen beim EuroFiducia Support. Wie kann ich helfen?',
    support_q1:'Wie zahle ich ein?',support_q2:'Wie zahle ich aus?',support_q3:'Welche Anlagen gibt es?',support_q4:'Wie setze ich mein Passwort zurück?',
    support_escalating:'Ich verbinde Sie mit einem Mitarbeiter. Bitte warten.',
    btn_continue:'Weiter',btn_back:'Zurück',btn_submit:'Absenden',btn_cancel:'Abbrechen',btn_save:'Speichern',btn_send:'Senden',btn_close:'Schließen',btn_view:'Ansehen',btn_download:'Herunterladen',
    msg_sent:'Nachricht gesendet',msg_saved:'Erfolgreich gespeichert',
  },
};
// Fallback: languages not fully translated use English with partial overrides
// ES, DE above. PT, AR, ZH, RU, HI use English fallback with key nav/hero overrides
I18N.pt = Object.assign({},I18N.en,{pending_title:'A sua conta está em análise',pf_title:'Portfólios de investimento regionais',
  nav_home:'Início',nav_login:'Entrar',nav_register:'Criar conta',nav_dashboard:'Painel',
  hero_title:'Invista em mercados globais',hero_cta1:'Criar conta',hero_cta2:'Explorar investimentos',
  cat_stocks:'Ações',cat_bonds:'Renda Fixa',cat_realestate:'Imobiliário',cat_crypto:'Criptoativos',
  dash_overview:'Resumo',dash_deposit:'Depositar',dash_withdraw:'Levantar',admin_users:'Utilizadores',
});
I18N.ar = Object.assign({},I18N.en,{pending_title:'حسابك قيد المراجعة',pf_title:'محافظ استثمارية إقليمية',
  nav_home:'الرئيسية',nav_login:'تسجيل الدخول',nav_register:'إنشاء حساب',nav_dashboard:'لوحة التحكم',
  hero_title:'استثمر في الأسواق العالمية',hero_cta1:'إنشاء حساب',hero_cta2:'استكشف الاستثمارات',
  cat_stocks:'الأسهم',cat_bonds:'الدخل الثابت',cat_realestate:'العقارات',cat_crypto:'العملات الرقمية',
  dash_overview:'نظرة عامة',dash_deposit:'إيداع',dash_withdraw:'سحب',admin_users:'المستخدمون',
});
I18N.zh = Object.assign({},I18N.en,{pending_title:'您的账户正在审核中',pf_title:'区域投资组合',
  nav_home:'首页',nav_login:'登录',nav_register:'创建账户',nav_dashboard:'仪表板',
  hero_title:'投资全球市场',hero_cta1:'创建账户',hero_cta2:'探索投资',
  cat_stocks:'股票',cat_bonds:'固定收益',cat_realestate:'房地产',cat_crypto:'加密资产',
  dash_overview:'概览',dash_deposit:'存款',dash_withdraw:'取款',admin_users:'用户',
});
I18N.ru = Object.assign({},I18N.en,{pending_title:'Ваш аккаунт на рассмотрении',pf_title:'Региональные инвестиционные портфели',
  nav_home:'Главная',nav_login:'Войти',nav_register:'Создать аккаунт',nav_dashboard:'Панель',
  hero_title:'Инвестируйте на мировых рынках',hero_cta1:'Создать аккаунт',hero_cta2:'Изучить инвестиции',
  cat_stocks:'Акции',cat_bonds:'Облигации',cat_realestate:'Недвижимость',cat_crypto:'Криптоактивы',
  dash_overview:'Обзор',dash_deposit:'Депозит',dash_withdraw:'Вывод',admin_users:'Пользователи',
});
I18N.hi = Object.assign({},I18N.en,{pending_title:'आपका खाता समीक्षा में है',pf_title:'क्षेत्रीय निवेश पोर्टफोलियो',
  nav_home:'होम',nav_login:'लॉग इन',nav_register:'खाता बनाएं',nav_dashboard:'डैशबोर्ड',
  hero_title:'वैश्विक बाजारों में निवेश करें',hero_cta1:'खाता बनाएं',hero_cta2:'निवेश खोजें',
  cat_stocks:'शेयर',cat_bonds:'बॉन्ड',cat_realestate:'रियल एस्टेट',cat_crypto:'क्रिप्टो',
  dash_overview:'अवलोकन',dash_deposit:'जमा',dash_withdraw:'निकासी',admin_users:'उपयोगकर्ता',
});

/* Translation function */
function t(key, lang) {
  lang = lang || getCurrentLang();
  var dict = I18N[lang] || I18N.en;
  return dict[key] || I18N.en[key] || key;
}

function getCurrentLang() {
  try { return localStorage.getItem('ev_lang') || detectLang(); } catch(e){ return 'en'; }
}
function setCurrentLang(code) {
  try { localStorage.setItem('ev_lang',code); } catch(e){}
}
function detectLang() {
  var bl = (navigator.language||'en').slice(0,2).toLowerCase();
  if (I18N[bl]) return bl;
  return 'en';
}

/* Apply translations to page elements with data-i18n attributes */
function applyTranslations(lang) {
  lang = lang || getCurrentLang();
  document.documentElement.lang = lang;
  if (lang==='ar') document.documentElement.dir='rtl'; else document.documentElement.dir='ltr';
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key = el.getAttribute('data-i18n');
    el.textContent = t(key, lang);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    var key = el.getAttribute('data-i18n-ph');
    el.placeholder = t(key, lang);
  });
  // Update lang button display
  var l = LANGS.find(function(x){return x.code===lang;});
  document.querySelectorAll('.lang-current-flag').forEach(function(el){ el.textContent = l?l.flag:'🇬🇧'; });
  document.querySelectorAll('.lang-current-name').forEach(function(el){ el.textContent = l?l.name:'English'; });
}

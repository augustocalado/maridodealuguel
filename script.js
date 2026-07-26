/* ==========================================================================
   MARIDO DE ALUGUEL EM GUARULHOS - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 2. Service Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. Quote Request Modal & WhatsApp Redirect
  const quoteModal = document.getElementById('quoteModal');
  const modalClose = document.getElementById('modalClose');
  const quoteButtons = document.querySelectorAll('.trigger-quote-modal');
  const quoteForm = document.getElementById('quoteForm');
  const modalServiceSelect = document.getElementById('modalService');

  // Open Modal
  quoteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceName && modalServiceSelect) {
        modalServiceSelect.value = serviceName;
      }
      if (quoteModal) {
        quoteModal.classList.add('active');
      }
    });
  });

  // Close Modal
  if (modalClose && quoteModal) {
    modalClose.addEventListener('click', () => {
      quoteModal.classList.remove('active');
    });

    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.classList.remove('active');
      }
    });
  }

  // Submit Form to WhatsApp
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('modalName').value;
      const phone = document.getElementById('modalPhone').value;
      const neighborhood = document.getElementById('modalNeighborhood').value;
      const service = document.getElementById('modalService').value;
      const details = document.getElementById('modalDetails').value;

      const whatsappNumber = '5511999999999'; // número comercial Guarulhos

      let message = `*SOLICITAÇÃO DE ORÇAMENTO - MARIDO DE ALUGUEL GUARULHOS*\n\n`;
      message += `*Nome:* ${name}\n`;
      if (phone) message += `*Telefone:* ${phone}\n`;
      message += `*Bairro em Guarulhos:* ${neighborhood}\n`;
      message += `*Serviço Desejado:* ${service}\n`;
      if (details) message += `*Observações:* ${details}\n\n`;
      message += `Olá! Gostaria de receber um orçamento rápido para este serviço.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(whatsappURL, '_blank');
      quoteModal.classList.remove('active');
    });
  }

  // 5. Blog Article Modal Reader
  const blogModal = document.getElementById('blogModal');
  const blogModalClose = document.getElementById('blogModalClose');
  const blogTriggers = document.querySelectorAll('.read-blog-btn');
  const blogModalTitle = document.getElementById('blogModalTitle');
  const blogModalBody = document.getElementById('blogModalBody');

  const blogArticlesData = {
    '1': {
      title: 'Como Instalar um Ventilador de Teto com Segurança em Guarulhos',
      category: 'Elétrica & Conforto',
      date: '18 de Julho, 2026',
      content: `
        <p>A instalação de um ventilador de teto exige atenção especial à fiação elétrica e à fixação no teto ou laje, garantindo que o aparelho funcione sem ruídos ou riscos de queda.</p>
        <h4>1. Verifique a Estrutura do Teto</h4>
        <p>O ventilador deve ser fixado em uma caixa de luz reforçada de metal ou diretamente no concreto da laje. Tetos de gesso rebaixado exigem suporte prolongado ancorado no teto estrutural.</p>
        <h4>2. Cheque a Voltagem e a Fiação</h4>
        <p>Em Guarulhos, a voltagem padrão é 110V/127V na maioria das residências, mas há instalações em 220V. É essencial identificar a fase, o neutro e o fio terra, além de passar a fiação do interruptor para controle de velocidade e luz.</p>
        <h4>3. Balanceamento das Pás</h4>
        <p>Pás desbalanceadas causam vibrações e desgaste precoce no motor. Certifique-se de que todas as pás estejam com os parafusos firmemente apertados.</p>
        <p><strong>Prefere não arriscar?</strong> Nossos profissionais em Guarulhos fazem a instalação rápida e limpa em menos de 1 hora!</p>
      `
    },
    '2': {
      title: 'Quando Trocar a Resistência do Chuveiro elétrico',
      category: 'Hidráulica & Elétrica',
      date: '10 de Julho, 2026',
      content: `
        <p>O chuveiro queimou ou parou de esquentar? Esse é um dos chamados mais frequentes que atendemos em apartamentos e casas em Guarulhos.</p>
        <h4>Sinais de que a resistência queimou:</h4>
        <ul>
          <li>A água sai fria mesmo com o seletor na posição "Inverno" ou "Quente".</li>
          <li>Você ouviu um pequeno estalo no chuveiro e a água esfriou imediatamente.</li>
          <li>O disjuntor do chuveiro disparou no quadro elétrico.</li>
        </ul>
        <h4>Cuidados ao trocar:</h4>
        <p>Desligue sempre o disjuntor geral ou o disjuntor do banheiro antes de manusear o chuveiro. Após a troca da resistência, deixe correr água fria por alguns segundos antes de religar a energia para evitar queimar a nova peça a seco!</p>
      `
    },
    '3': {
      title: 'Como Escolher o Suporte de TV Ideal para sua Parede',
      category: 'Instalações & TV',
      date: '02 de Julho, 2026',
      content: `
        <p>Fixar a TV na parede libera espaço no painel ou rack e deixa o ambiente muito mais moderno e elegante.</p>
        <h4>Tipos de Suportes:</h4>
        <ul>
          <li><strong>Fixos:</strong> Ideais para salas e quartos onde a TV fica paralela à parede. Baixo custo e ultra discreto.</li>
          <li><strong>Inclináveis:</strong> Permitem ajustar o ângulo vertical para eliminar reflexos de luz.</li>
          <li><strong>Articulados:</strong> Perfeitos para ambientes integrados ou cantos, permitindo girar a TV para diferentes ângulos.</li>
        </ul>
        <h4>Atenção ao Tipo de Parede:</h4>
        <p>Paredes de drywall necessitam de buchas específicas para gesso (como a bucha Fly ou basculante). Em paredes de bloco estrutural ou tijolo baiano, as buchas convencionais de 8mm ou 10mm garantem sustentação total.</p>
      `
    },
    '4': {
      title: 'Quanto Custa Montar Móveis em Guarulhos? Guia Completo',
      category: 'Montagem de Móveis',
      date: '25 de Junho, 2026',
      content: `
        <p>Comprou um guarda-roupa, mesa, rack ou armário de cozinha pela internet e precisa de montagem profissional em Guarulhos?</p>
        <p>O valor da montagem varia conforme a complexidade, dimensão do móvel e quantidade de portas/gavetas. Em geral, pequenos móveis (como cômodas e mesas de cabeceira) têm valores super acessíveis, enquanto guarda-roupas grandes de portas de correr exigem maior tempo de montagem e regulagem de portas.</p>
        <p>Chame a nossa equipe no WhatsApp para enviar uma foto do manual ou do link do móvel e receba um orçamento exato e sem compromisso!</p>
      `
    },
    '5': {
      title: 'Pequenos Reparos que Evitam Grandes Problemas no Apartamento',
      category: 'Manutenção Residencial',
      date: '15 de Junho, 2026',
      content: `
        <p>Ignorar pequenos vazamentos ou tomadas esquentando pode custar caro no futuro. Confira os reparos mais preventivos para condomínios:</p>
        <ul>
          <li><strong>Vazamentos em Torneiras e Sifões:</strong> Um gotejamento contínuo danifica armários de mdf e aumenta a conta de água do condomínio.</li>
          <li><strong>Tomadas Frouxas ou Queimadas:</strong> Evita mal contato e curtos elétricos em eletrodomésticos caros.</li>
          <li><strong>Silicone no Box do Banheiro:</strong> Previne infiltrações de água para o vizinho do andar de baixo.</li>
        </ul>
      `
    },
    '6': {
      title: 'Dicas de Manutenção Residencial Preventiva para Casas e Condomínios',
      category: 'Dicas de Casa',
      date: '05 de Junho, 2026',
      content: `
        <p>Manter a manutenção da sua residência em dia garante valorização do imóvel, economia de energia e tranquilidade para sua família.</p>
        <p>Crie um checklist semestral para inspecionar fechaduras, vedação de janelas, limpeza de sifões e teste de disjuntores DR. Conte com um Marido de Aluguel profissional em Guarulhos para cuidar de tudo para você com garantia!</p>
      `
    }
  };

  blogTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const articleId = btn.getAttribute('data-article');
      const article = blogArticlesData[articleId];

      if (article && blogModal && blogModalTitle && blogModalBody) {
        blogModalTitle.textContent = article.title;
        blogModalBody.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <span style="color: var(--accent); font-weight:700; font-size: 0.85rem; text-transform: uppercase;">${article.category}</span>
            <span style="color: var(--gray-600); font-size:0.85rem; margin-left: 1rem;">📅 ${article.date}</span>
          </div>
          ${article.content}
        `;
        blogModal.classList.add('active');
      }
    });
  });

  if (blogModalClose && blogModal) {
    blogModalClose.addEventListener('click', () => {
      blogModal.classList.remove('active');
    });

    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) {
        blogModal.classList.remove('active');
      }
    });
  }

  // 6. Direct WhatsApp Link Helper for Floating Button & CTAs
  const directWhatsappBtns = document.querySelectorAll('.direct-whatsapp-link');
  directWhatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const whatsappNumber = '5511999999999';
      const defaultMsg = encodeURIComponent('Olá! Encontrei seu site no Google e gostaria de solicitar um orçamento para atendimento em Guarulhos.');
      window.open(`https://wa.me/${whatsappNumber}?text=${defaultMsg}`, '_blank');
    });
  });

  // 7. Scroll Animation Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .diff-card, .step-card, .review-card, .blog-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease-out';
    observer.observe(el);
  });
});

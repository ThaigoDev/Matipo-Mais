 document.addEventListener('DOMContentLoaded', () => {
            const carousel = document.getElementById('carousel-job');
            const prevBtn = document.querySelector('.prev-btn-jb');
            const nextBtn = document.querySelector('.next-btn-jb');
            
            let currentIndex = 0;
            let cardsPerView = 3;
            let totalCards = carousel.children.length;
            
            // Ajusta o número de cards por visualização baseado na largura da tela
            function updateCardsPerView() {
                if (window.innerWidth > 1024) {
                    cardsPerView = 3;
                } else if (window.innerWidth > 768) {
                    cardsPerView = 2;
                } else {
                    cardsPerView = 1;
                }
            }
            
            // Função para atualizar o carrossel
            function updateCarousel() {
                const cardWidth = carousel.children[0].offsetWidth + 20; // largura do card + gap
                const maxIndex = totalCards - cardsPerView;
                
                // Limita o índice
                currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
                
                // Aplica transformação
                carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                
                // Atualiza estado dos botões
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= maxIndex;
            }

            // Evento para o botão próximo
            nextBtn.addEventListener('click', () => {
                if (currentIndex < totalCards - cardsPerView) {
                    currentIndex++;
                    updateCarousel();
                }
            });

            // Evento para o botão anterior
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            // Lida com resize da janela
            window.addEventListener('resize', () => {
                updateCardsPerView();
                updateCarousel();
            });

            // Inicialização
            updateCardsPerView();
            updateCarousel();
        }); 

        
 document.addEventListener('DOMContentLoaded', () => {
            const carousel = document.getElementById('carousel-business');
            const prevBtn = document.querySelector('.prev-btn-bs');
            const nextBtn = document.querySelector('.next-btn-bs');
            
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
            carousel.addEventListener('mousedown', (e) => {
                isDragging = true;
                carousel.style.cursor = 'grabbing';
                startX = e.pageX - carousel.offsetLeft;
                scrollLeft = carousel.scrollLeft;
            });

            carousel.addEventListener('mouseleave', () => {
                isDragging = false;
                carousel.style.cursor = 'grab';
            });

            carousel.addEventListener('mouseup', () => {
                isDragging = false;
                carousel.style.cursor = 'grab';
            });

            carousel.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX) * 2; // Multiplicador para velocidade de scroll
                carousel.scrollLeft = scrollLeft - walk;
            });

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
        
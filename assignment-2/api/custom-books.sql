-- books from assignment 2

-- updated categories 
INSERT INTO categories (name, description) VALUES
('Fiction', 'Novels, short stories, and other imaginative narratives'),
('Non-Fiction', 'Factual books about real events, people, and subjects'),
('Classic Literature', 'Significant literary works that have stood the test of time'),
('Self-Help & Psychology', 'Books focused on personal development and understanding the mind'),
('Design & Art', 'Works on visual design, typography, and artistic expression'),
('Memoir', 'Personal narratives and reflections'),
('Philosophy', 'Exploration of fundamental questions about existence and knowledge');

-- insert your custom book collection with updated information
-- format - title, author, description, publication_year, cover_image, category_id

INSERT INTO books (title, author, description, publication_year, cover_image, category_id) VALUES
('All Quiet on the Western Front', 'Erich Maria Remarque', 'A groundbreaking novel portraying the psychological and physical brutality of World War I through the eyes of a young German soldier.', 1929, 'allquietonthewesternfront.jpg', 1),

('Breaking the Habit of Being Yourself', 'Dr. Joe Dispenza', 'Combines quantum physics, neuroscience, and brain chemistry to teach how to change behavioral patterns and create a new reality through meditation and mindfulness.', 2012, 'breakingthehabitofbeingyourself.jpg', 4),

('Crime and Punishment', 'Fyodor Dostoevsky', 'A profound psychological novel that explores the moral dilemmas of Raskolnikov, a poor ex-student who murders a pawnbroker, believing himself to be above conventional morality.', 1866, 'crimeandpunishment.jpg', 3),

('Don Quixote', 'Miguel de Cervantes', 'Widely considered the first modern novel, this satirical adventure follows the delusional nobleman Don Quixote and his loyal squire Sancho Panza through a series of comedic and poignant misadventures.', 1605, 'donquixote.jpg', 3),

('Flow: The Psychology of Optimal Experience', 'Mihaly Csikszentmihalyi', 'Explores the concept of "flow" - a state of complete immersion in an activity - and how it contributes to creativity, fulfillment, and overall psychological well-being.', 1990, 'flow.jpg', 4),

('Flowers for Algernon', 'Daniel Keyes', 'A poignant science fiction story chronicling the intellectual and emotional journey of Charlie Gordon, a man with an IQ of 68 who undergoes an experimental procedure to increase his intelligence.', 1966, 'flowersforalgernon.jpg', 1),

('Graphic Design Manual', 'Armin Hofmann', 'A foundational text on design principles that emphasizes form and basic elements as essential tools for visual communication, focusing on the methodology and principles rather than passing trends.', 1965, 'graphicdesignmanual.jpg', 5),

('Grid Systems in Graphic Design', 'Josef Müller-Brockmann', 'A comprehensive guide to understanding and using grid systems in visual communication, highlighting their importance in organizing information and creating harmonious layouts.', 1981, 'gridsystem.jpg', 5),

('Portraits', 'Gunnerstahl', 'A striking collection of intimate photographic portraits that capture the raw essence of their subjects, challenging conventional beauty standards and celebrating authenticity.', 2018, 'gunnerstahl.jpg', 5),

('How Design makes the World', 'Scott Berkun', 'An exploration of how design impacts every aspect of our daily lives, from the products we use to the systems we navigate, emphasizing the crucial role design plays in solving complex problems.', 2020, 'howdesignmakestheworld.jpg', 5),

('Johnny Got his Gun', 'Dalton Trumbo', 'A powerful anti-war novel told from the perspective of a young American soldier who has lost his arms, legs, and face in World War I, exploring themes of patriotism, sacrifice, and the human cost of conflict.', 1939, 'johhnygothisgun.jpg', 1),

('Karma', 'Sadhguru', 'A spiritual exploration of the concept of karma, challenging common misconceptions and offering practical wisdom on how understanding karma can lead to greater self-awareness and fulfillment.', 2021, 'karma.jpg', 7),

('Kitchen Confidential', 'Anthony Bourdain', 'A candid, behind-the-scenes memoir that reveals the often chaotic and intense world of professional kitchens, based on the late chef\'s experiences in the culinary industry.', 2000, 'kitchenconfidential.jpg', 6),

('Psycho-Cybernetics', 'Maxwell Maltz', 'A pioneering self-help book introducing the concept of self-image as the key to human personality and behavior, offering techniques to improve self-perception and achieve personal goals.', 1960, 'psychocybernetics.jpg', 4),

('Disorder Swiss Grit Vol. II', 'Chris Ashworth', 'An experimental design book that challenges traditional Swiss design principles, embracing controlled chaos and disruption while honoring the historical legacy of Swiss graphic design.', 2017, 'swissgrut.jpg', 5),

('The Stranger', 'Albert Camus', 'An existentialist novel following Meursault, a French Algerian who commits a murder and faces his execution with detached indifference, exploring themes of absurdism, alienation, and the human condition.', 1942, 'thestranger.jpg', 7),

('The Tipping Point', 'Malcolm Gladwell', 'An examination of how ideas, products, messages, and behaviors spread like viruses, identifying three key factors—the Law of the Few, the Stickiness Factor, and the Power of Context—that make something tip into widespread popularity.', 2000, 'thetippingpoint.jpg', 2),

('The War of Art', 'Steven Pressfield', 'A guide for writers, artists, and anyone pursuing creative endeavors, addressing the internal obstacles and resistance that prevent people from reaching their creative potential.', 2002, 'thewarofart.jpg', 4),

('Thinking with Type: 3rd Edition', 'Ellen Lupton', 'A definitive guide to using typography in visual communication, covering everything from letterforms and the fundamentals of reading to using type on the web and creating typographic systems.', 2010, 'thinkingwithtype.jpg', 5);
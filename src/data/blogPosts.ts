export interface BlogPost {
  id: number;
  slug: string;
  titleEn: string;
  titleEs: string;
  img: string;
  contentEn: string[];
  contentEs: string[];
  dateEn: string;
  dateEs: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "the-strong-tower-of-security",
    titleEn: "The Strong Tower of Security",
    titleEs: "La Torre Fuerte de Seguridad",
    dateEn: "March 20, 2026",
    dateEs: "20 de Marzo, 2026",
    img: "/blog-armored-door.png",
    contentEn: [
      "I recently visited a relative in their new home. Upon opening the door, they proudly remarked that it was an armored door—and that everyone in their building had one. At the time, the comment struck me as just another technical detail; however, after returning home, I found myself reflecting on that constant quest for security that we humans share.",
      "An armored door serves as a physical reinforcement against external threats, but what about the security of our hearts and our families?",
      'In Proverbs 18:10, we find a powerful promise: <em>&quot;The name of the Lord is a strong tower; the righteous run into it and are safe.&quot;</em>',
      "Here, we see that seeking God is the ultimate way to protect ourselves and maintain our peace in the face of any circumstance that attempts to steal it away. When we gather as a family to worship, pray, and share His Word, we are doing exactly that: running toward that strong tower where we are safe under His care.",
      "That is precisely our mission at Selah Kids. We want to be that safe haven for your family—a space where both children and adults can find the tools and the environment needed to learn more about Jesus and strengthen their spiritual foundations.",
      "What tools or habits help your family feel safe and at peace in your daily life? We'd love to read about your experiences in the comments!"
    ],
    contentEs: [
      "Hace poco visité a un familiar en su nueva casa. Al abrir la puerta, me comentó con orgullo que era una puerta blindada, y que todos en su edificio tenían una. En ese momento, el comentario me pareció un detalle técnico más; sin embargo, al regresar a casa, me encontré reflexionando sobre esa constante búsqueda de seguridad que los humanos compartimos.",
      "Una puerta blindada sirve como un refuerzo físico frente a las amenazas externas, pero ¿qué pasa con la seguridad de nuestros corazones y familias?",
      'En Proverbios 18:10, encontramos una poderosa promesa: <em>&quot;Torre fuerte es el nombre del Señor; a él corre el justo y está a salvo.&quot;</em>',
      "Aquí vemos que buscar a Dios es la forma definitiva de protegernos y mantener nuestra paz frente a cualquier circunstancia que intente robárnosla. Cuando nos reunimos en familia para adorar, orar y compartir su Palabra, estamos haciendo exactamente eso: correr hacia esa torre fuerte donde estamos a salvo bajo su cuidado.",
      "Esa es precisamente nuestra misión en Selah Kids. Queremos ser ese refugio seguro para tu familia, un espacio donde tanto niños como adultos puedan encontrar las herramientas y el ambiente necesarios para aprender más de Jesús y fortalecer sus bases espirituales.",
      "¿Qué herramientas o hábitos ayudan a tu familia a sentirse segura y en paz en la vida diaria? ¡Nos encantaría leer sus experiencias en nuestras redes sociales!"
    ]
  },
  {
    id: 2,
    slug: "are-we-repeating-patterns",
    titleEn: "Are We Repeating Patterns?",
    titleEs: "¿Estamos Repitiendo Patrones?",
    dateEn: "March 15, 2026",
    dateEs: "15 de Marzo, 2026",
    img: "/blog-repeating-patterns.png",
    contentEn: [
      'Every time she prepared fish, the young woman would cut off its head and tail. One day, intrigued, her husband asked her: <em>&quot;Why do you always cut the ends off the fish?&quot;</em> <em>&quot;I don\'t really know,&quot;</em> she replied. <em>&quot;My mom always did it that way.&quot;</em>',
      'At the next family gathering, they asked her mother the same question. She said: <em>&quot;Well, that\'s how I saw my mom always did it.&quot;</em> And when they went to consult the grandmother, she answered: <em>&quot;The thing is, back then, my frying pan was too small, and the fish wouldn\'t fit in it whole.&quot;</em>',
      'Without realizing it, we walk through life using <em>&quot;small frying pans&quot;</em> that we inherited from our great-grandparents, grandparents, and parents. We were shaped by their very values—and perhaps their fears—repeating traditions that, at the time, served a practical purpose, but which today may be limiting our growth.',
      "Many of us desire different results, yet we continue to apply the same formulas.",
      'The Bible offers us a powerful promise for these moments of change: <em>&quot;Therefore, if anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new&quot;</em> (2 Corinthians 5:17).',
      "As we embrace this truth, a new identity is born within us. We are no longer bound to repeat the cycle out of inertia; we now have the freedom to act differently. We are sowing a new seed, and although the change may take time, the harvest will be unlike anything we have ever known.",
      "<strong>The Filter for Our Actions</strong>",
      'When facing any habit we wish to change, the key question is: <em>&quot;How would Jesus handle this if He were in my place?&quot;</em> The answer lies not in our own strength, but in our willingness to act according to His example.',
      "Certainly, some actions will require greater effort and perseverance. It is natural to feel resistance when attempting to break old patterns, but we draw that resolve from God. By turning to Him in prayer—acknowledging our limitations and asking for His guidance—His grace empowers us to accomplish what once seemed impossible. Let us always seek the answer in His Word; let us allow it to be the mirror that shows us who we truly are in Him. Your past may serve as a reference, but thanks be to God, it no longer has to be your destiny."
    ],
    contentEs: [
      'Cada vez que preparaba pescado, la joven le cortaba la cabeza y la cola. Un día, intrigado, su marido le preguntó: <em>&quot;¿Por qué siempre le cortas los extremos al pescado?&quot;</em> <em>&quot;La verdad no sé,&quot;</em> respondió ella. <em>&quot;Mi mamá siempre lo hacía así.&quot;</em>',
      'En la siguiente reunión familiar le hicieron la misma pregunta a su madre. Ella dijo: <em>&quot;Bueno, así es como veía que mi mamá siempre lo hacía.&quot;</em> Y cuando fueron a consultar a la abuela, ella respondió: <em>&quot;Lo que pasa es que, en aquel entonces, mi sartén era muy pequeño y el pescado no cabía entero.&quot;</em>',
      'Sin darnos cuenta, caminamos por la vida usando <em>&quot;sartenes pequeños&quot;</em> que heredamos de nuestros bisabuelos, abuelos y padres. Fuimos formados por sus mismos valores —y tal vez por sus miedos— repitiendo tradiciones que, en su momento, cumplieron un propósito práctico, pero que hoy podrían estar limitando nuestro crecimiento.',
      "Muchos de nosotros deseamos resultados diferentes, pero seguimos aplicando las mismas fórmulas.",
      'La Biblia nos ofrece una promesa poderosa para estos momentos de cambio: <em>&quot;De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas&quot;</em> (2 Corintios 5:17).',
      "Al abrazar esta verdad, nace en nosotros una nueva identidad. Ya no estamos obligados a repetir el ciclo por inercia; ahora tenemos la libertad de actuar diferente. Estamos sembrando una nueva semilla, y aunque el cambio tome tiempo, la cosecha será distinta a todo lo que hayamos conocido.",
      "<strong>El Filtro para Nuestras Acciones</strong>",
      'Al enfrentarnos a cualquier hábito que deseemos cambiar, la pregunta clave es: <em>&quot;¿Cómo manejaría Jesús esto si estuviera en mi lugar?&quot;</em> La respuesta no radica en nuestras propias fuerzas, sino en nuestra disposición a actuar según Su ejemplo.',
      "Ciertamente, algunas acciones requerirán de mayor esfuerzo y perseverancia. Es natural sentir resistencia al intentar romper patrones antiguos, pero sacamos esa resolución de Dios. Al volvernos a Él en oración —reconociendo nuestras limitaciones y pidiendo Su guía— Su gracia nos capacita para lograr lo que alguna vez pareció imposible. Busquemos siempre la respuesta en Su Palabra; permitamos que sea el espejo que nos muestra quiénes somos realmente en Él. Tu pasado puede servir como referencia, pero gracias a Dios, ya no tiene por qué ser tu destino."
    ]
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function getPostById(id: number): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.id === id);
}

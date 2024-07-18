# **Biblioteca de Ícones Animalia**

<img src="/meta/tamandua.png" width="128" align="right" />

[![NPM](https://img.shields.io/npm/v/animalia-icon.svg?style=flat-square)](https://www.npmjs.com/package/animalia-icon)

[![GitHub stars](https://img.shields.io/github/stars/animalia-icon?style=flat-square&label=Star)](https://github.com/animalia-icon/web)

[![GitHub forks](https://img.shields.io/github/forks/animalia-icon?style=flat-square&label=Fork)](https://github.com/animalia-icon/fork)

[![GitHub watchers](https://img.shields.io/github/watchers/animalia-icon?style=flat-square&label=Watch)](https://github.com/animaliads/animalia-icon)

## **Instalação 💾**

Adicione a biblioteca de ícones Animalia ao seu projeto com o npm:

```jsx
npm i animalia-icon
```

## **Uso 🚀**

Nossos ícones funcionam como fontes da web, facilitando a inserção em seu site. Basta adicionar um arquivo ao seu documento e usar tags simples para exibir ícones nítidos e escaláveis em vários estilos.

```html
<!doctype html>
<html>
  <head>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://unpkg.com/animalia-icon/@1.0.5/src/regular/style.css"
    />
  </head>
  <body>
    <i class="ph ph-smiley"></i>
  </body>
</html>
```

> _Nota: Você pode importar quantos pesos forem necessários. Apenas os pesos importados corresponderão e serão renderizados como ícones._

## Pesos ✨

Os ícones Animalia vêm em 2 pesos: regular e preenchido. Para usar um peso, você deve incluir um link para sua folha de estilo e usar a classe de peso apropriada no ícone (o peso regular usa `.ph` em vez de `.ph-regular`):

## Estilização 🎨

Ícones Animalia são essencialmente texto, então você pode estilizá-los com CSS como qualquer fonte. Personalize o font-size, color e muito mais para combinar com seu design.

Precisa de opções rápidas de dimensionamento? Temos tudo o que você precisa com estas classes auxiliares:

```css
.ph-xxs {
  font-size: 0.5em;
}
.ph-xs {
  font-size: 0.75em;
}
.ph-sm {
  font-size: 0.875em;
}
/* ...e mais! */
```

> Evite sobrescrever font-family, font-style, font-weight, font-variant ou text-transform. Fazer isso pode quebrar os ícones e exibir caracteres incorretos.

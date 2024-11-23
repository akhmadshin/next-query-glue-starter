// eslint-disable-next-line @typescript-eslint/no-require-imports
const loremIpsum = require("lorem-ipsum").loremIpsum;

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const createTitle = () => {
  const words = loremIpsum({ count: 2, units: 'words' });
  return capitalizeFirstLetter(words);
}

const createParagraph = () => {
  return loremIpsum({
    units: 'paragraphs',
    paragraphLowerBound: 4,
    sentenceLowerBound: 6,
  })
}

const createMockArticle = (id) => {


  const previewContent = [
    {
      type: 'heading',
      children: [
        {
          type: 'text',
          text: createTitle()
        }
      ],
      level: 2
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
  ];

  const content = [
    {
      type: 'heading',
      children: [
        {
          type: 'text',
          text: createTitle()
        }
      ],
      level: 2
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
    {
      type: 'heading',
      children: [
        {
          type: 'text',
          text: createTitle()
        }
      ],
      level: 2
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
    {
      type: 'heading',
      children: [
        {
          type: 'text',
          text: createTitle(),
          bold: true
        }
      ],
      level: 2
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: createParagraph(),
        }
      ]
    }
  ];

  return {
    id,
    attributes: {
      title: `Lorem ipsum ${id}`,
      description: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: createParagraph(),
            }
          ]
        }
      ],
      slug: `lorem-ipsum-${id}`,
      content: content,
      previewContent,
      headings: getHeadings([...previewContent, ...content]),
      thumbnail: MOCK_THUMBNAILS[id % 99 % MOCK_THUMBNAILS.length]
    }
  }
};

module.exports = { createMockArticle }

const getHeadings = (content) => {
  return  content
    .filter((el) => el.type === 'heading' && el.level === 2)
    .map((el) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const title = el.children[0].text.replace(/[^a-zA-Z ]/g, "");
      const hash = title.toLowerCase().replace(/\s/g, '_')
      return {
        title,
        hash,
      }
    });

}

const MOCK_THUMBNAILS = [
  {
    data: {
      id: 23,
      attributes: {
        thumbhash: 'LggGDYJCJgJfWoiHhlZ2aEFtsP8X',
        name: 'patrick_perkins_ETR_Pjvb0_KM_0_unsplash.jpg',
        alternativeText: null,
        height: 1280,
        width: 1920
      }
    }
  },
  {
    data: {
      id: 23,
      attributes: {
        thumbhash: 'GIYFNJBpjSWRl3hwR3J4f4T3Vw==',
        name: 'markus_spiske_vr_CU_Lk_Ac5_E_unsplash.jpg',
        alternativeText: null,
        height: 1080,
        width: 1920
      }
    }
  },
  {
    data: {
      attributes: {
        thumbhash: 'dDkGDYL7Fsl9hnmNgky4dnKAJwVX',
        name: 'jakub_dziubak_Xt_Ud5_Si_X464_unsplash.jpg',
        alternativeText: null,
        height: 1282,
        width: 1920
      }
    }
  },
  {
    data: {
      attributes: {
        thumbhash: 'BhgKDYQXiId2iHeAfJd4elSAhwVH',
        name: 'joshua_reddekopp_Sy_Ym_XS_Dn_J54_unsplash.jpg',
        alternativeText: null,
        height: 1280,
        width: 1920
      }
    }
  }
]
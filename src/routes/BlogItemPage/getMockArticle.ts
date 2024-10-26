import { MOCK_THUMBNAILS } from '@/routes/BlogItemPage/MOCK_THUMBNAILS';
import { MOCK_HEADINGS } from '@/routes/BlogItemPage/MOCK_HEADINGS';
import { ArticleItemApi, Heading } from '@/types/api';

export const getMockArticle = (id: number) => {
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
              text: 'Etiam finibus sit amet felis semper ultricies. Sed vestibulum vestibulum ipsum, vel consequat eros pellentesque sit amet. Proin nec dictum velit. Vestibulum mollis augue id lorem dictum, sed luctus tortor sollicitudin. In ut neque tortor. Maecenas ut bibendum erat, non varius magna. Proin placerat a magna quis congue. Fusce viverra dui sed ex aliquam, in consectetur erat aliquam. Integer sed venenatis elit. Integer porttitor in massa non facilisis. Aenean lobortis facilisis pretium. Praesent eu erat egestas, rutrum odio non, ultricies ligula.'
            }
          ]
        }
      ],
      slug: 'lorem-ipsum',
      content: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              text: 'Gloriosa ostentatio'
            }
          ],
          level: 2
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Gloriosa ostentatio in constituendo summo bono, consectetur adipiscing elit. Duo Reges: constructio interrete. Ergo opifex plus sibi proponet ad formarum quam civis excellens ad factorum pulchritudinem? Consequentia exquirere, quoad sit id, quod volumus, effectum. Theophrastus mediocriterne delectat, cum tractat locos ab Aristotele ante tractatos?'
            }
          ]
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Cyrenaici quidem non recusant; Qui-vere falsone, quaerere mittimus-dicitur oculis se privasse; Sic, et quidem diligentius saepiusque ista loquemur inter nos agemusque communiter. Nonne igitur tibi videntur, inquit, mala? Restant Stoici, qui cum a Peripateticis et Academicis omnia transtulissent, nominibus aliis easdem res secuti sunt. Sed plane dicit quod intellegit. Ut optime, secundum naturam affectum esse possit. Mihi enim satis est, ipsis non satis. Erat enim Polemonis. Quo igitur, inquit, modo? Nam de isto magna dissensio est. Quid iudicant sensus? Illa tamen simplicia, vestra versuta.'
            }
          ]
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              text: 'Utrum igitur'
            }
          ],
          level: 2
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Immo alio genere; Omnes enim iucundum motum, quo sensus hilaretur. Ergo adhuc, quantum equidem intellego, causa non videtur fuisse mutandi nominis. Quia nec honesto quic quam honestius nec turpi turpius. Quid, si etiam iucunda memoria est praeteritorum malorum? In quibus doctissimi illi veteres inesse quiddam caeleste et divinum putaverunt.'
            }
          ]
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Iam in altera philosophiae parte. Omnia contraria, quos etiam insanos esse vultis. Utinam quidem dicerent alium alio beatiorem! Iam ruinas videres. Sin eam, quam Hieronymus, ne fecisset idem, ut voluptatem illam Aristippi in prima commendatione poneret.'
            }
          ]
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              text: 'Estne, quaeso'
            }
          ],
          level: 2
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Ergo illi intellegunt quid Epicurus dicat, ego non intellego? Quae quo sunt excelsiores, eo dant clariora indicia naturae. Id Sextilius factum negabat. Cur post Tarentum ad Archytam? Graecis hoc modicum est: Leonidas, Epaminondas, tres aliqui aut quattuor; Hoc loco tenere se Triarius non potuit.'
            }
          ]
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Septem autem illi non suo, sed populorum suffragio omnium nominati sunt. Non risu potius quam oratione eiciendum? Causa autem fuit huc veniendi ut quosdam hinc libros promerem. Qua tu etiam inprudens utebare non numquam. Videsne quam sit magna dissensio? Tibi hoc incredibile, quod beatissimum. Quae contraria sunt his, malane? Explanetur igitur. Tecum optime, deinde etiam cum mediocri amico. Tria genera bonorum; Videsne quam sit magna dissensio? Facillimum id quidem est, inquam.'
            }
          ]
        },
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              text: 'Maecenas viverra',
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
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Erat enim Polemonis. Duo Reges: constructio interrete. Istic sum, inquit. Bonum incolumis acies: misera caecitas. Dat enim intervalla et relaxat. Quid enim possumus hoc agere divinius?'
            }
          ]
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Nam Pyrrho, Aristo, Erillus iam diu abiecti. Id mihi magnum videtur. Quid de Pythagora? Praeteritis, inquit, gaudeo. Quare conare, quaeso. Idemne, quod iucunde? Sed residamus, inquit, si placet. Res enim concurrent contrariae. Si id dicis, vicimus. Quod cum dixissent, ille contra. Qua tu etiam inprudens utebare non numquam. Deinde dolorem quem maximum? Quid iudicant sensus? Est enim effectrix multarum et magnarum voluptatum. Huius, Lyco, oratione locuples, rebus ipsis ielunior. Etenim semper illud extra est, quod arte comprehenditur. Bork'
            }
          ]
        }
      ],
      headings: MOCK_HEADINGS as Heading[],
      thumbnail: MOCK_THUMBNAILS[id % MOCK_THUMBNAILS.length]
    }
  } as never as ArticleItemApi
};
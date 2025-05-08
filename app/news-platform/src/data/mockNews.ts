import type { NewsResponse } from '../types';

export const mockNewsData: NewsResponse = {
  items: [
    {
      article_id: '1',
      title: 'Global Tech Conference Announces Breakthrough in Quantum Computing',
      description: 'Major tech companies reveal collaborative effort that achieved quantum supremacy',
      summary: 'A coalition of tech giants announced a significant breakthrough in quantum computing technology at this year\'s Global Tech Summit.',
      content: 'In a groundbreaking announcement at the Global Tech Summit, a consortium of leading technology companies revealed they have achieved a major milestone in quantum computing. The collaborative project demonstrated quantum supremacy by solving complex calculations that would take traditional supercomputers thousands of years to complete.',
      publishedAt: '2023-12-15T10:30:00Z',
      category: 'Technology',
      source: 'https://example.com/tech-news/quantum-breakthrough',
      image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      article_id: '2',
      title: 'Climate Summit Reaches Historic Agreement on Emissions Reduction',
      description: '197 countries sign binding accord to limit global warming to 1.5 degrees Celsius',
      summary: 'After two weeks of intense negotiations, world leaders at the Global Climate Summit have reached a landmark agreement on reducing carbon emissions.',
      content: 'In what environmentalists are calling a watershed moment for climate action, representatives from 197 countries have signed a binding agreement to substantially reduce carbon emissions over the next decade.',
      publishedAt: '2023-11-28T18:45:00Z',
      category: 'Environment',
      source: 'https://example.com/environment/climate-summit-agreement',
      image_url: 'https://images.unsplash.com/photo-1564088408210-2303c04316fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      article_id: '3',
      title: 'Medical Researchers Develop Promising Alzheimer\'s Treatment',
      description: 'Early clinical trials show 65% reduction in disease progression',
      summary: 'A team of international researchers has developed a new treatment approach that shows remarkable promise in slowing the progression of Alzheimer\'s disease.',
      content: 'A revolutionary new approach to treating Alzheimer\'s disease has shown exceptional promise in early clinical trials, potentially offering hope to millions of patients and their families worldwide.',
      publishedAt: '2023-12-03T08:15:00Z',
      category: 'Health',
      source: 'https://example.com/health/alzheimers-breakthrough',
      image_url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      article_id: '4',
      title: 'Global Stock Markets Rally as Inflation Fears Ease',
      description: 'Major indices hit record highs as economic data points to soft landing',
      summary: 'Stock markets around the world surged on Tuesday as new economic data suggested inflation is cooling without triggering a recession.',
      content: 'Global financial markets experienced a powerful rally on Tuesday as investors reacted to economic data suggesting that inflation is cooling without triggering the widely feared recession.',
      publishedAt: '2023-12-12T16:20:00Z',
      category: 'Finance',
      source: 'https://example.com/finance/markets-rally-inflation-data',
      image_url: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      article_id: '5',
      title: 'Archeologists Uncover Ancient City in Egyptian Desert',
      description: 'Vast 3,400-year-old settlement reveals new insights into New Kingdom period',
      summary: 'An international team of archeologists has discovered a well-preserved ancient city buried in the Egyptian desert, described as the most significant find since King Tutankhamun\'s tomb.',
      content: 'Archeologists working in southern Egypt have uncovered an extensive ancient city buried beneath the desert sands, in what experts are calling the most significant archeological discovery in the country since the tomb of Tutankhamun.',
      publishedAt: '2023-12-10T09:45:00Z',
      category: 'History',
      source: 'https://example.com/history/ancient-egyptian-city-discovery',
      image_url: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      article_id: '6',
      title: 'Revolutionary Electric Aircraft Completes First Commercial Flight',
      description: 'Zero-emission plane carries 30 passengers on 300-mile journey',
      summary: 'Aviation history was made yesterday as the world\'s first fully electric commercial passenger aircraft completed its inaugural revenue flight.',
      content: 'In a milestone for sustainable aviation, the world\'s first fully electric commercial aircraft successfully completed its inaugural passenger flight yesterday, carrying 30 passengers on a 300-mile journey with zero direct emissions.',
      publishedAt: '2023-12-14T14:30:00Z',
      category: 'Technology',
      source: 'https://example.com/tech/electric-aircraft-first-flight',
      image_url: 'https://images.unsplash.com/photo-1559060009-9dcd64f769f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      article_id: '7',
      title: 'Major Sporting Goods Company Switches to 100% Recycled Materials',
      description: 'Sportex commits to using only recycled or renewable materials by 2025',
      summary: 'Global sporting goods giant Sportex announced today that it will transition to using 100% recycled or renewable materials in all its products by 2025.',
      content: 'Global sporting goods manufacturer Sportex has announced an ambitious sustainability initiative that will see the company transition to using 100% recycled or renewable materials across its entire product range by 2025.',
      publishedAt: '2023-12-08T11:15:00Z',
      category: 'Environment',
      source: 'https://example.com/environment/sportex-recycled-materials',
      image_url: 'https://images.unsplash.com/photo-1561141891-ed8421183cde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      article_id: '8',
      title: 'Study Finds Daily Meditation Significantly Reduces Stress Hormones',
      description: 'Research shows 15 minutes of meditation daily lowers cortisol levels by 25%',
      summary: 'A large-scale study has found that just 15 minutes of daily meditation can reduce stress hormone levels by up to 25% within eight weeks.',
      content: 'A groundbreaking study published in the Journal of Neurophysiology has found that just 15 minutes of daily meditation can reduce levels of the stress hormone cortisol by an average of 25% within eight weeks.',
      publishedAt: '2023-12-05T10:00:00Z',
      category: 'Health',
      source: 'https://example.com/health/meditation-reduces-stress-hormones',
      image_url: 'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      article_id: '9',
      title: 'New Legislation Aims to Make Internet Access a Basic Right',
      description: 'Bipartisan bill would classify high-speed internet as essential utility',
      summary: 'A new bipartisan bill introduced in Congress seeks to classify high-speed internet access as an essential utility and guarantee affordable access for all citizens.',
      content: 'A landmark bill introduced with bipartisan support in Congress aims to reclassify high-speed internet access as an essential utility, potentially transforming how broadband services are regulated and accessed across the country.',
      publishedAt: '2023-12-11T13:45:00Z',
      category: 'Politics',
      source: 'https://example.com/politics/internet-access-legislation',
      image_url: 'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      article_id: '10',
      title: 'Scientists Confirm Viable Way to Capture Carbon Directly From Air',
      description: 'Breakthrough technology reduces carbon capture costs by over 70%',
      summary: 'Researchers have demonstrated a new carbon capture method that can remove CO₂ directly from the atmosphere at significantly lower costs than previous technologies.',
      content: 'A team of international scientists has demonstrated a breakthrough in direct air carbon capture technology that could significantly accelerate efforts to reduce atmospheric CO₂ levels and combat climate change.',
      publishedAt: '2023-12-09T15:30:00Z',
      category: 'Science',
      source: 'https://example.com/science/carbon-capture-breakthrough',
      image_url: 'https://images.unsplash.com/photo-1518148644971-dc701e596285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ]
};

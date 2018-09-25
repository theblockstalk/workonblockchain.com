import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable()
export class SeoService {

  constructor(private meta: Meta) { }

  generateTags(config) {
    // default values
    config = { 
      title: 'Work on Blockchain', 
      description: 'Global blockchain agnostic recruitment hiring platform for blockchain developers, software developers, designers, product managers, CTOs, researchers and software engineer interns who are passionate about public and enterprise blockchain technology and cryptocurrencies. On workonblockchain.com, companies apply to active candidates looking for jobs.', 
      image: 'https://workonblockchain.com/assets/images/WOB.jpeg',
      slug: '',
      ...config
    }

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Work on Blockchain' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: 'https://workonblockchain.com/' });
  }

}
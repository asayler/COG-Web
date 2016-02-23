module Jekyll
  class GitHashGenerator < Generator
    safe true

    def generate(site)
      sha1 = %x( git rev-parse HEAD ).strip
      site.data['long_hash'] = sha1
      site.data['short_hash'] = sha1[0..6]
    end
  end
end

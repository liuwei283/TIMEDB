class Organ < ApplicationRecord
    has_many :projects, dependent: :destroy
    validates :primary_site, presence: true, uniqueness: { 
      message: ->(object, data) do
        "Organ #{data[:value]} already exists. "
      end
    }, on: :create
  
    def self.import(file)
      CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
        organ = find_by_primary_site(row['primary_site'])|| new
        organ.attributes = row.to_hash.slice(*column_names)
        organ.save!
      end
    end


    def self.to_csv(options={})
      CSV.generate(options) do |csv|
        csv << column_names
        all.each do |organ|
          csv << organ.attributes.values_at(*column_names)
        end
      end
    end

    def self.selected_to_csv(organ_ids, options={})
      CSV.generate(options) do |csv|
        csv << column_names
        organ_ids.each do |id|
          organ = Organ.find(id)
          csv << organ.attributes.values_at(*column_names)
        end
      end
    end
end
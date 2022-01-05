class Cancer < ApplicationRecord
    has_many :projects
    validates :cancer_type, presence: true, uniqueness: { 
      message: ->(object, data) do
        "Cancer #{data[:value]} already exists. "
      end
    }, on: :create
  
    def self.import(file)
      CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
        cancer = find_by_cancer_type(row['cancer_type'])|| new
        cancer.attributes = row.to_hash.slice(*column_names)
        cancer.save!
      end
    end


    def self.to_csv(options={})
      CSV.generate(options) do |csv|
        csv << column_names
        all.each do |cancer|
          csv << cancer.attributes.values_at(*column_names)
        end
      end
    end

    def self.selected_to_csv(cancer_ids, options={})
      CSV.generate(options) do |csv|
        csv << column_names
        cancer_ids.each do |id|
          cancer = Cancer.find(id)
          csv << cancer.attributes.values_at(*column_names)
        end
      end
    end
end
class Analysis < ApplicationRecord
    has_many :viz_file_objects
    has_many :analysis_user_data
    belongs_to :analysis_category
    belongs_to :visualizer

    def self.import(file)
        CSV.foreach(file.path, headers: true, encoding: 'bom|utf-8') do |row|
          a = find_by_name(row['name'])|| new
          a.attributes = row.to_hash.slice(*column_names)
          a.save!
        end
    end
end
